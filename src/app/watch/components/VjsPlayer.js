"use client";

import VideoPlayer from "@/app/components/molecules/VideoPlayer/VideoJS";
import React, { useCallback, useMemo, memo } from "react";
import { videoProgressService } from "@/services/videoProgressService";
import toast from "react-hot-toast";

const VjsPlayer = ({ downloadData, onVideoEnd }) => {
	const videoFile = downloadData?.files?.find(
		(file) => file.file_ext === "mp4" || file.file_ext === "mkv",
	);

	const videoSrc = `https://archive.org/download/${downloadData.id}/${videoFile.name}`;

	const subtitles = useMemo(() => {
		if (!downloadData?.files) return [];
		return downloadData.files
			.filter(
				(file) =>
					file.file_ext === "vtt" || file.file_ext === "srt",
			)
			.map((file) => ({
				src: `/api/v1/subtitle?url=${encodeURIComponent(`https://archive.org/download/${downloadData.id}/${file.name}`)}`,
				label: file.name.replace(/\.(vtt|srt)$/i, "").replace(/_/g, " "),
				lang: "en",
			}));
	}, [downloadData?.id, downloadData?.files]);

	const handleLoadedMetadata = useCallback(
		async (media) => {
			try {
				const savedProgress = await videoProgressService.getProgress(
					downloadData?.uuid,
				);
				if (
					savedProgress?.currentTime &&
					(savedProgress?.watchedPercentage === undefined ||
						savedProgress?.watchedPercentage <= 85)
				) {
					media.currentTime = savedProgress.currentTime;
				}

				if (
					savedProgress?.watchedPercentage &&
					savedProgress?.watchedPercentage > 85
				) {
					toast("Continue watching time reset", {
						icon: "🔄",
						position: "bottom-right",
					});
				}
			} catch (error) {
				console.error("Failed to load video progress:", error);
			}
		},
		[downloadData?.uuid],
	);

	const handleTimeUpdate = useCallback(
		async (currentTime, duration) => {
			try {
				await videoProgressService.saveProgress(
					downloadData?.uuid,
					currentTime,
					duration,
				);
				await videoProgressService.cleanupOldEntries();
			} catch (error) {
				console.error("Failed to save video progress:", error);
			}
		},
		[downloadData?.uuid],
	);

	const handleEnded = useCallback(() => {
		if (onVideoEnd) {
			onVideoEnd();
		}
	}, [onVideoEnd]);

	return (
		<div className="video-wrapper mt-2 rounded-lg overflow-hidden" style={{ "--media-border-radius": "0.5rem" }}>
			<VideoPlayer
				src={videoSrc}
				subtitles={subtitles}
				autoPlay={true}
				onLoadedMetadata={handleLoadedMetadata}
				onTimeUpdate={handleTimeUpdate}
				onEnded={handleEnded}
			/>
		</div>
	);
};

const areEqual = (prevProps, nextProps) => {
	return (
		prevProps.downloadData.id === nextProps.downloadData.id &&
		prevProps.downloadData.uuid === nextProps.downloadData.uuid &&
		prevProps.onVideoEnd === nextProps.onVideoEnd
	);
};

export default memo(VjsPlayer, areEqual);
