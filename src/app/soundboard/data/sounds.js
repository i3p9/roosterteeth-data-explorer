import { config } from "@/app/Constants";
const baseUrl = config.url.BASE_URL;


export const SoundSource = [{
    path: `${baseUrl}/sound/raw/alfredo_1.mp3`,
    title: "Alfredo"
}, {
    path: `${baseUrl}/sound/raw/daddy_wants_some.mp3`,
    title: "Daddy wants some"
}, {
    path: `${baseUrl}/sound/raw/im_over_here.mp3`,
    title: "I'm over here"
}, {
    path: `${baseUrl}/sound/raw/mmmmmaybe.mp3`,
    title: "Mmmmmaybe"
}, {
    path: `${baseUrl}/sound/raw/please_stop_2.mp3`,
    title: "Please. Stop."
}, {
    path: `${baseUrl}/sound/raw/what.mp3`,
    title: "What"
}, {
    path: `${baseUrl}/sound/raw/alfredo_2.mp3`,
    title: "Alfredo!"
}, {
    path: `${baseUrl}/sound/raw/do_it.mp3`,
    title: "Do it!"
}, {
    path: `${baseUrl}/sound/raw/im_right_here.mp3`,
    title: "I'm right here"
}, {
    path: `${baseUrl}/sound/raw/no_1.mp3`,
    title: "No!"
}, {
    path: `${baseUrl}/sound/raw/really_stop.mp3`,
    title: "Really, stop."
}, {
    path: `${baseUrl}/sound/raw/yeah.mp3`,
    title: "Yeah"
}, {
    path: `${baseUrl}/sound/raw/alfredo_3.mp3`,
    title: "Alfredo."
}, {
    path: `${baseUrl}/sound/raw/dont_do_that.mp3`,
    title: "Don't do that"
}, {
    path: `${baseUrl}/sound/raw/ive_got_meeting.mp3`,
    title: "I've got to go to a meeting"
}, {
    path: `${baseUrl}/sound/raw/no_2.mp3`,
    title: "Nooo"
}, {
    path: `${baseUrl}/sound/raw/stahahahhhp.mp3`,
    title: "Stahahahhhp"
}, {
    path: `${baseUrl}/sound/raw/yeah_baybee.mp3`,
    title: "Yeah Baybeeee"
}, {
    path: `${baseUrl}/sound/raw/are_you_kidding_me.mp3`,
    title: "Are you kidding me?"
}, {
    path: `${baseUrl}/sound/raw/listen_ive_got_meeting.mp3`,
    title: "Listen, I've got a meeting"
}, {
    path: `${baseUrl}/sound/raw/no_3.mp3`,
    title: "NOOO!"
}, {
    path: `${baseUrl}/sound/raw/stahhhp.mp3`,
    title: "Stahhhp"
}, {
    path: `${baseUrl}/sound/raw/yeahhh_baybee.mp3`,
    title: "Yeahhh Baybeeee"
}, {
    path: `${baseUrl}/sound/raw/are_you_kidding_me_2.mp3`,
    title: "Are you kidding me?!"
}, {
    path: `${baseUrl}/sound/raw/i_dont_know_1.mp3`,
    title: "I don't know"
}, {
    path: `${baseUrl}/sound/raw/maybe.mp3`,
    title: "Maybe"
}, {
    path: `${baseUrl}/sound/raw/no_singing.mp3`,
    title: "No singing!"
}, {
    path: `${baseUrl}/sound/raw/stahhhp_yell.mp3`,
    title: "STAHHHP!"
}, {
    path: `${baseUrl}/sound/raw/yes.mp3`,
    title: "Yes"
}, {
    path: `${baseUrl}/sound/raw/big_dog.mp3`,
    title: "Big Dogs gotta eat"
}, {
    path: `${baseUrl}/sound/raw/i_dont_know_2.mp3`,
    title: "I DON'T know"
}, {
    path: `${baseUrl}/sound/raw/mmaybe.mp3`,
    title: "Mmmaybe"
}, {
    path: `${baseUrl}/sound/raw/please_stop_1.mp3`,
    title: "Please stop"
}, {
    path: `${baseUrl}/sound/raw/stop_singing.mp3`,
    title: "Stop singing"
}]

const sortedSoundSource = [...SoundSource];
sortedSoundSource.sort((a, b) => a.title.localeCompare(b.title));
export { sortedSoundSource }
