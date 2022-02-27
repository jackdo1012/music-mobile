import React, { useEffect, useState } from "react";
import globalStyle from "../GlobalStyle";
import colors from "../../app/colors";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    SafeAreaView,
} from "react-native";
import variables from "../../app/variables";
import Image from "react-native-scalable-image";
import styleVariables from "../../app/styleVariables";
import { IMusic } from "../../app/type";

const Music = () => {
    const [musicList, setMusicList] = useState<IMusic[]>([]);
    useEffect(() => {
        fetch(`${variables.serverUrl}/api/musics`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setMusicList(data))
            .catch((err) => {
                if (
                    err.response &&
                    err.isAxiosError &&
                    err.response.status === 404
                ) {
                    setMusicList([]);
                }
            });
    }, []);
    return (
        <SafeAreaView style={[globalStyle.page, styles.musics]}>
            <ScrollView>
                <Text>Music</Text>
                {musicList.map((music, index) => (
                    <View style={styles.music} key={index}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.title}
                        >
                            {music.name}
                        </Text>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.artist}
                        >
                            {music.artist}
                        </Text>
                        <Image
                            source={{ uri: music.thumbnail }}
                            width={
                                Dimensions.get("window").width * 0.8 -
                                4 * styleVariables.fontSize
                            }
                        />
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    musics: {},
    music: {
        padding: 2 * styleVariables.fontSize,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: Dimensions.get("window").width * 0.8,
        marginTop: styleVariables.fontSize * 1.2,
        marginBottom: styleVariables.fontSize * 0.7,
        marginLeft: Dimensions.get("window").width * 0.1,
        borderColor: colors.darkBorder,
        borderWidth: 5,
        borderStyle: "solid",
        borderRadius: styleVariables.fontSize,
    },
    title: {
        color: colors.darkPrimaryColor,
        textAlign: "center",
        overflow: "hidden",
        margin: styleVariables.fontSize,
        maxWidth: "100%",
        fontSize: styleVariables.fontSize * 1.3,
    },
    artist: {
        color: colors.darkTextColor,
        fontStyle: "italic",
        textAlign: "center",
        margin: 0.5 * styleVariables.fontSize,
        overflow: "hidden",
    },
    thumbnail: {
        width:
            Dimensions.get("window").width * 0.8 - 4 * styleVariables.fontSize,
    },
});

export default Music;
