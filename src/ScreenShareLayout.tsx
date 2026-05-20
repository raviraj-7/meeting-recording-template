import React, { useEffect, useState } from 'react';
import { LocalParticipant, RemoteParticipant, Track, TrackPublication } from 'livekit-client';
import { TrackReference } from '@livekit/components-core';
import { ParticipantTile } from '@livekit/components-react';

interface ScreenShareLayoutProps {
    participants: (RemoteParticipant | LocalParticipant)[];
    tracks: TrackReference[];
    screenShareTrack: TrackReference;
}

export const ScreenShareLayout: React.FC<ScreenShareLayoutProps> = ({
    participants,
    tracks,
    screenShareTrack,
}) => {
    const [promotedList, setPromotedList] = useState<string[]>([]);

    // Initialize promoted list once on mount
    useEffect(() => {
        const screenSharerId = screenShareTrack.participant.identity;

        setPromotedList((prevList) => {
            const newList = [...prevList];

            // Add screen sharer first if not already there
            if (!newList.includes(screenSharerId)) {
                newList.unshift(screenSharerId);
            }

            // Add other participants if not already present
            participants.forEach((p) => {
                if (!newList.includes(p.identity)) {
                    newList.push(p.identity);
                }
            });

            return newList;
        });
    }, [participants.length, screenShareTrack.participant.identity]);

    // Promote new active speakers (move them just after screen sharer)
    useEffect(() => {
        const activeSpeakers = participants.filter((p) => p.isSpeaking).map((p) => p.identity);

        if (activeSpeakers.length === 0) return;

        setPromotedList((prevList) => {
            const screenSharerId = screenShareTrack.participant.identity;
            const screenSharerIndex = prevList.indexOf(screenSharerId);
            const newList = [...prevList];

            activeSpeakers.forEach((speakerId) => {
                if (speakerId === screenSharerId) return;

                const currentIndex = newList.indexOf(speakerId);
                if (currentIndex === -1) {
                    // new participant not yet in promoted list — add right after screen sharer
                    newList.splice(screenSharerIndex + 1, 0, speakerId);
                } else if (currentIndex > screenSharerIndex + 1) {
                    // move to right after screen sharer if not already there
                    newList.splice(currentIndex, 1);
                    newList.splice(screenSharerIndex + 1, 0, speakerId);
                }
            });

            return newList;
        });
    }, [participants, screenShareTrack]);

    return (
        <div className='rosterLayoutWrapper' style={{ display: 'flex', }}>
            {/* Sidebar */}
            <div className='rosterLayout'
                style={{
                    height: ' 100vh',
                    // overflow: 'auto',
                    flex: '1 0 17%',
                    display: 'block',

                }}>
                {promotedList.map((identity) => {
                    const participant = participants.find((p) => p.identity === identity);

                    if (!participant) return null;

                    const videoTrack = tracks.find(
                        (track) =>
                            track.participant.identity === participant.identity &&
                            track.publication.kind === Track.Kind.Video
                    );

                    const isSpeaking = participant.isSpeaking;

                    return (
                        <div
                            style={{ marginBottom: '10px', }}
                            key={participant.identity}
                            className={`participant_identity ${isSpeaking ? "speaking" : ""}`}
                        >
                            {videoTrack ? (
                                <ParticipantTile trackRef={videoTrack} />
                            ) : (
                                <div className='participant_wrap'
                                    style={{ height: '96px', }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ width: '80px', }}>
                                        <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" /></svg>
                                </div>
                            )}
                            <div className='participant_name'>
                                {participant.name || participant.identity}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Screen share content */}
            <div
                style={{
                    flex: '1 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'black',
                }}
            >
                <ParticipantTile trackRef={screenShareTrack} />
            </div>
        </div>
    );
};
