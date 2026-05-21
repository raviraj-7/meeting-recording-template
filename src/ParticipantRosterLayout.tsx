import React, { useEffect, useState } from 'react';
import { LocalParticipant, RemoteParticipant, Track } from 'livekit-client';
import { TrackReference } from '@livekit/components-core';
import { ParticipantTile } from '@livekit/components-react';

interface ParticipantRosterLayoutProps {
  participants: (RemoteParticipant | LocalParticipant)[];
  tracks: TrackReference[];
}

export const ParticipantRosterLayout: React.FC<ParticipantRosterLayoutProps> = ({
  participants,
  tracks,
}) => {
  const [ordered, setOrdered] = useState<(RemoteParticipant | LocalParticipant)[]>([]);

  useEffect(() => {
    setOrdered((prev) => {
      // Keep any existing order
      const currentIds = prev.map((p) => p.identity);

      // Add new participants (not in prev)
      const newOnes = participants.filter((p) => !currentIds.includes(p.identity));

      return [...prev, ...newOnes];
    });
  }, [participants]);

  useEffect(() => {
    setOrdered((prev) => {
      // If anyone is speaking, move them to the front
      const speaking = prev.filter((p) => p.isSpeaking);
      const notSpeaking = prev.filter((p) => !p.isSpeaking);

      // Put currently speaking ones first, then the rest in their existing order
      return [...speaking, ...notSpeaking];
    });
  }, [participants.map((p) => p.isSpeaking).join(',')]); // re-run when speaking status changes

  return (
    <div className="rosterLayoutWrapper">
      <div className="rosterLayout">
        {ordered.filter((participant) => !participant?.identity?.includes("EG_")).map((participant) => {
          const videoTrack = tracks.find(
            (track) =>
              track.participant.identity === participant.identity &&
              track.publication.kind === Track.Kind.Video,
          );
          const isSpeaking = participant.isSpeaking;

          return (
            <div
              className={`participant_identity ${isSpeaking ? 'speaking' : ''}`}
              key={participant.identity}
            >
              {videoTrack ? (
                <ParticipantTile trackRef={videoTrack} />
              ) : (
                <div className="participant_wrap">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                  </svg>
                </div>
              )}
              <div className="participant_name">{
                (participant?.name?.includes("note-taker") ? "Note Taker" : participant.name) || 
                (participant?.identity?.includes("note-taker") ? "Note Taker" : participant.identity)
              }</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
