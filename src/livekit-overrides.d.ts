import '@livekit/components-react';

declare module '@livekit/components-react' {
  import React from 'react';
  import { TrackReferenceOrPlaceholder } from '@livekit/components-core';

  export function LiveKitRoom(props: React.PropsWithChildren<{
    serverUrl?: string;
    token?: string;
    onError?: (error: Error) => void;
    [key: string]: any;
  }>): React.ReactElement | null;

  export function ParticipantTile(props: {
    trackRef?: TrackReferenceOrPlaceholder;
    [key: string]: any;
  }): React.ReactElement | null;

  export function VideoTrack(props: {
    trackRef?: TrackReferenceOrPlaceholder;
    [key: string]: any;
  }): React.ReactElement | null;

  export function RoomAudioRenderer(props?: {}): React.ReactElement | null;

  export function GridLayout(props: React.PropsWithChildren<{
    tracks: TrackReferenceOrPlaceholder[];
    [key: string]: any;
  }>): React.ReactElement | null;

  export function CarouselLayout(props: React.PropsWithChildren<{
    tracks: TrackReferenceOrPlaceholder[];
    [key: string]: any;
  }>): React.ReactElement | null;

  export function FocusLayout(props: {
    trackRef?: TrackReferenceOrPlaceholder;
    [key: string]: any;
  }): React.ReactElement | null;
}