import React, { useEffect, useState } from "react";
import {
    Dimensions,
    StyleSheet,
    TextInput,
    ScrollView,
    SafeAreaView,
} from "react-native";
import colors from "../../app/colors";
import styleVariables from "../../app/styleVariables";
import { IArtist } from "../../app/type";
import variables from "../../app/variables";
import globalStyle from "../GlobalStyle";
import EachArtist from "./EachArtist";

const Artist: React.FC = function () {
    const [searchValue, setSearchValue] = useState<string>("");
    const [artists, setArtists] = useState<IArtist[]>([]);

    useEffect(() => {
        fetch(`${variables.serverUrl}/api/artists`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setArtists(data))
            .catch((err) => {
                if (
                    err.response &&
                    err.isAxiosError &&
                    err.response.status === 404
                ) {
                    setArtists([]);
                }
            });
    }, []);

    useEffect(() => {
        if (searchValue !== "") {
            fetch(`${variables.serverUrl}/api/artists/${searchValue}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setArtists(data);
                })
                .catch((err) => {
                    if (
                        err.response &&
                        err.isAxiosError &&
                        err.response.status === 404
                    ) {
                        setArtists([]);
                    }
                });
        } else {
            fetch(`${variables.serverUrl}/api/artists`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => setArtists(data))
                .catch((err) => {
                    if (
                        err.response &&
                        err.isAxiosError &&
                        err.response.status === 404
                    ) {
                        setArtists([]);
                    }
                });
        }
    }, [searchValue]);

    return (
        <SafeAreaView style={[globalStyle.page, styles.artists]}>
            <ScrollView>
                <TextInput
                    style={styles.artistsSearch}
                    onChangeText={setSearchValue}
                    value={searchValue}
                />
                {artists.map((artist) => (
                    <EachArtist artist={artist} key={artist.id} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    artists: {},
    artistsSearch: {
        width: Dimensions.get("window").width * 0.8,
        marginTop: styleVariables.fontSize,
        marginRight: "auto",
        marginBottom: styleVariables.fontSize,
        marginLeft: Dimensions.get("window").width * 0.1,
        backgroundColor: colors.darkNav,
        borderRadius: styleVariables.fontSize,
        fontSize: styleVariables.fontSize * 1.5,
        color: colors.darkTextColor,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: colors.darkBorder,
        paddingVertical: styleVariables.fontSize * 0.5,
        paddingHorizontal: styleVariables.fontSize,
    },
});

export default Artist;
