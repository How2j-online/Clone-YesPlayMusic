import { InjectionKey } from "vue/dist/vue";
import TrackListItem from "@/components/TrackList/TrackListItem.vue";

export const RCTProvideKey = Symbol("rightClickTrack") as InjectionKey<TrackListItem>;
