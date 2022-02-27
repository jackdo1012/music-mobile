import React, { useEffect, useRef, useState } from "react";
import {
    Text,
    SafeAreaView,
    StyleSheet,
    View,
    Dimensions,
    ScrollView,
    Pressable,
} from "react-native";
import Image from "react-native-scalable-image";
import colors from "../../app/colors";
import styleVariables from "../../app/styleVariables";
import { IMusic } from "../../app/type";
import variables from "../../app/variables";
import globalStyle from "../GlobalStyle";
import SockJS from "sockjs-client";
import Stomp, { Message } from "webstomp-client";
import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";
import Ionicons from "react-native-vector-icons/Ionicons";

const Home: React.FC = function () {
    const [musics, setMusics] = useState<IMusic[]>([]);
    const [vidId, setVidId] = useState<string>("");
    const [mute, setMute] = useState<boolean>(true);
    const [startTime, setStartTime] = useState<number>(0);
    const playerRef = useRef<YoutubeIframeRef>(null);

    const updateList = () => {
        fetch(`${variables.serverUrl}/api/musics`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setMusics(data);
            })
            .catch((err) => {
                if (
                    err.response &&
                    err.isAxiosError &&
                    err.response.status === 404
                ) {
                    setMusics([]);
                }
            });
    };

    useEffect(() => {
        updateList();
        const socket = new SockJS(`${variables.serverUrl}/ws`);
        const stompClient = Stomp.over(socket, {
            debug: false,
        });

        stompClient.connect({}, () => {
            stompClient.subscribe("/topic/updateTrack", () => {
                updateList();
            });
            stompClient.subscribe(
                "/user/topic/playingVideo",
                (music: Message) => {
                    setVidId(JSON.parse(music.body).song.vidId);
                    setStartTime(JSON.parse(music.body).duration);
                },
            );
            stompClient.subscribe("/topic/playingVideo", (music: Message) => {
                setVidId(JSON.parse(music.body).song.vidId);
            });
        });
        return () => {
            stompClient.disconnect();
        };
    }, []);

    const handleMuteUnmute = () => {
        setMute((prev) => !prev);
    };

    return (
        <SafeAreaView style={[globalStyle.page, styles.homepage]}>
            <Text style={styles.title}>Jack Do's Music Page</Text>
            <Text style={styles.description}>
                Hi, I'm Jack Do and this is some of my favorite music.
            </Text>
            <View style={styles.mainPage}>
                <View style={styles.player}>
                    <Pressable onPress={handleMuteUnmute} style={styles.mute}>
                        {mute ? (
                            <Ionicons
                                name="volume-mute"
                                color={colors.darkTextColor}
                                size={styleVariables.fontSize * 4}
                            />
                        ) : (
                            <Ionicons
                                name="volume-high"
                                color={colors.darkTextColor}
                                size={styleVariables.fontSize * 4}
                            />
                        )}
                    </Pressable>
                    <View pointerEvents="none" style={styles.iframe}>
                        {vidId !== "" && startTime !== 0 ? (
                            <YoutubePlayer
                                height={300}
                                videoId={vidId}
                                mute={mute}
                                forceAndroidAutoplay={true}
                                play={true}
                                ref={playerRef}
                                initialPlayerParams={{
                                    controls: false,
                                    preventFullScreen: true,
                                    start: startTime,
                                }}
                            />
                        ) : (
                            <></>
                        )}
                    </View>
                    {musics.length > 0 && vidId !== "" && (
                        <Text style={styles.playerTitle}>
                            {
                                musics[
                                    musics.indexOf(
                                        musics.filter(
                                            (music) => music.vidId === vidId,
                                        )[0],
                                    )
                                ].name
                            }
                        </Text>
                    )}
                </View>
                <ScrollView style={styles.musics}>
                    {musics.map((music) => (
                        <View key={music.id} style={styles.music}>
                            <Image
                                source={{ uri: music.thumbnail }}
                                height={styleVariables.fontSize * 7}
                            />
                            <View style={styles.musicInfo}>
                                <Text
                                    ellipsizeMode="tail"
                                    style={styles.musicTitle}
                                >
                                    {music.name}
                                </Text>
                                <Text style={styles.musicArtist}>
                                    {music.artist}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    homepage: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        textAlign: "center",
        padding: styleVariables.fontSize * 2,
        fontSize: styleVariables.fontSize * 2.5,
        color: colors.darkPrimaryColor,
        // font-family: "Roboto Mono", monospace;
    },
    description: {
        textAlign: "center",
        fontStyle: "italic",
        color: colors.darkTextColor,
    },
    mainPage: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: Dimensions.get("window").width,
        maxWidth: 1600,
        marginTop: styleVariables.fontSize * 2,
        marginBottom: styleVariables.fontSize * 2,
    },
    player: {
        width: Dimensions.get("window").width * 0.9,
        borderWidth: 5,
        borderStyle: "solid",
        borderColor: colors.darkBorder,
        borderRadius: styleVariables.fontSize,
        padding: styleVariables.fontSize,
    },
    mute: {
        width: styleVariables.fontSize * 4,
        height: styleVariables.fontSize * 4,
        position: "relative",
    },
    iframe: {
        width: "100%",
        height: 0,
        position: "relative",
        paddingBottom: "56.25%",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.darkBorder,
    },
    playerTitle: {
        fontSize: styleVariables.fontSize * 1.35,
        padding: styleVariables.fontSize,
        textAlign: "center",
        color: colors.darkTextColor,
    },
    musics: {
        marginTop: styleVariables.fontSize * 1.5,
        height: "80%",
        backgroundColor: colors.darkGrey,
        paddingHorizontal: styleVariables.fontSize,
        borderRadius: styleVariables.fontSize,
        width: Dimensions.get("window").width * 0.9,
    },
    music: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        height: styleVariables.fontSize * 9,
    },
    musicInfo: {
        height: styleVariables.fontSize * 7,
    },
    musicTitle: {
        color: colors.darkTextColor,
        width:
            Dimensions.get("window").width * 0.9 -
            styleVariables.fontSize * 2.5 -
            styleVariables.fontSize * 7 * 1.765432,
        fontSize: styleVariables.fontSize * 1.1,
        textAlign: "left",
        maxHeight: styleVariables.fontSize * 4,
    },
    musicArtist: {
        color: colors.darkTextColor,
        width:
            Dimensions.get("window").width * 0.9 -
            styleVariables.fontSize * 2.5 -
            styleVariables.fontSize * 7 * 1.765432,
        fontSize: styleVariables.fontSize * 1.1,
        textAlign: "left",
        maxHeight: styleVariables.fontSize * 3,
        opacity: 0.8,
    },
});

export default Home;
