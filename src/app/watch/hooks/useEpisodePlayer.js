import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

export const useEpisodePlayer = (episodeSlug, initialEpisodeData) => {
	const [nowPlayingEpisodeSlug, setNowPlayingEpisodeSlug] =
		useState(episodeSlug);
	const [isUnavailable, setIsUnavailable] = useState(false);
	const [wasArchived, setWasArchived] = useState(true);
	const [episode, setEpisode] = useState(initialEpisodeData);
	const [nextEpisodes, setNextEpisodes] = useState();
	const [nextEpisodesLoading, setNextEpisodesLoading] =
		useState(false);
	const [downloadData, setDownloadData] = useState({});
	const previousSeasonIdRef = useRef(null);
	const autoPlayNextSlugRef = useRef(null);

	const getEpisodeData = async () => {
		if (initialEpisodeData && nowPlayingEpisodeSlug === episodeSlug) {
			setDownloadData(initialEpisodeData.archive);
			return;
		}

		try {
			const response = await axios.get(`/api/v1/episode`, {
				params: { slug: nowPlayingEpisodeSlug },
			});
			if (response.data.documents) {
				setEpisode(response.data.documents[0]);
				setDownloadData(response.data.documents[0].archive);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const getNextEpisodesData = async () => {
		const currentSeasonId = episode?.attributes.season_id;

		if (previousSeasonIdRef.current === currentSeasonId) {
			return;
		}

		setNextEpisodesLoading(true);
		try {
			const response = await axios.get(`/api/v1/season`, {
				params: { uuid: currentSeasonId },
			});
			if (response.data.documents) {
				setNextEpisodes(response.data.documents);
				previousSeasonIdRef.current = currentSeasonId;
			}
		} catch (error) {
			console.error(error);
		} finally {
			setNextEpisodesLoading(false);
		}
	};

	useEffect(() => {
		getEpisodeData();
	}, [nowPlayingEpisodeSlug]);

	useEffect(() => {
		if (episode) {
			getNextEpisodesData();
			document.title = `${episode?.attributes.title} / rt-archive`;
			if (episode?.archive?.status === "dark") {
				setIsUnavailable(true);
			}
			if (!episode?.archive) {
				setWasArchived(false);
				setIsUnavailable(true);
			}
		}
	}, [episode]);

	useEffect(() => {
		if (nextEpisodes) {
			const currentIndex = nextEpisodes.findIndex(
				(ep) => ep.attributes.slug === nowPlayingEpisodeSlug
			);

			const nextEpisode = nextEpisodes[currentIndex + 1];
			if (nextEpisode) {
				autoPlayNextSlugRef.current = nextEpisode.attributes.slug;
			}
		}
	}, [nextEpisodes, nowPlayingEpisodeSlug]);

	const handleVideoEnd = useCallback(() => {
		const nextSlug = autoPlayNextSlugRef.current;
		if (nextSlug) {
			setNowPlayingEpisodeSlug(nextSlug);
		} else {
			console.warn("autoPlayNextSlug is undefined");
		}
	}, []);

	return {
		nowPlayingEpisodeSlug,
		setNowPlayingEpisodeSlug,
		isUnavailable,
		wasArchived,
		episode,
		nextEpisodes,
		nextEpisodesLoading,
		downloadData,
		handleVideoEnd,
	};
};
