import React, { useState, memo, useEffect } from "react";
import Image from "react-native-scalable-image";
import {
    Animated,
    Dimensions,
    View,
    StyleSheet,
    Text,
    Pressable,
} from "react-native";
import colors from "../../app/colors";
import styleVariables from "../../app/styleVariables";
import { IArtist } from "../../app/type";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface Props {
    artist: IArtist;
}

const EachArtist: React.FC<Props> = function ({ artist }) {
    const [open, setOpen] = useState<boolean>(false);
    const [openData, _setOpenData] = useState<Animated.Value>(
        new Animated.Value(0),
    );

    useEffect(() => {
        Animated.timing(openData, {
            toValue: open ? 1 : 0,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [open]);

    const heightData = openData.interpolate({
        inputRange: [0, 1],
        outputRange: [0, artist.songs.length * 80],
    });

    const rotateData = openData.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "90deg"],
    });

    return (
        <View style={styles.artist}>
            <Pressable
                style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                }}
                onPress={() => setOpen((prev) => !prev)}
            >
                <Text style={styles.artistName}>{artist.name}</Text>
                <Animated.View style={{ transform: [{ rotate: rotateData }] }}>
                    <MaterialIcons
                        name={"arrow-right"}
                        size={styleVariables.fontSize * 1.2}
                        color={colors.darkPrimaryColor}
                    />
                </Animated.View>
            </Pressable>

            <Animated.View style={[styles.artistSongs, { height: heightData }]}>
                {artist.songs.map((song) => (
                    <View style={styles.artistSong} key={song.id}>
                        <View style={styles.artistSongImg}>
                            <Image
                                source={{ uri: song.thumbnail }}
                                height={80}
                                style={styles.artistSongImgThumbnail}
                            />
                        </View>
                        <Text style={styles.artistSongName}>{song.name}</Text>
                    </View>
                ))}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    artist: {
        padding: styleVariables.fontSize * 2,
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        width: Dimensions.get("window").width * 0.8,
        borderRadius: styleVariables.fontSize,
        marginTop: styleVariables.fontSize * 1.2,
        marginRight: 0,
        marginBottom: styleVariables.fontSize * 1.2,
        marginLeft: Dimensions.get("window").width * 0.1,
        borderWidth: 5,
        borderStyle: "solid",
        borderColor: colors.darkBorder,
    },
    artistName: {
        padding: styleVariables.fontSize * 0.5,
        fontSize: styleVariables.fontSize * 1.2,
        color: colors.darkPrimaryColor,
    },
    artistSongs: {
        overflow: "hidden",
        width: "100%",
    },
    artistSong: {
        height: 100,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingVertical: styleVariables.fontSize,
        paddingHorizontal: 0,
    },
    artistSongImg: {
        height: 80,
    },
    artistSongImgThumbnail: {},
    artistSongName: {
        color: colors.darkTextColor,
        marginLeft: styleVariables.fontSize * 0.4,
        width:
            Dimensions.get("window").width * 0.8 -
            styleVariables.fontSize * 7.4 -
            80 * 1.765432,
    },
});

export default memo(EachArtist);
