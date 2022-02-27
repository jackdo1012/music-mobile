import { NavigationContainer } from "@react-navigation/native";
import Home from "./components/Home/Home";
import Music from "./components/Music/Music";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Artist from "./components/Artist/Artist";
import { StatusBar } from "react-native";
import colors from "./app/colors";

const Tab = createBottomTabNavigator();

const App = function () {
    return (
        <NavigationContainer>
            <StatusBar
                backgroundColor={colors.darkMainBackground}
                barStyle="light-content"
                networkActivityIndicatorVisible={true}
                translucent={false}
            />
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarStyle: {
                        backgroundColor: colors.darkNav,
                    },
                    tabBarIcon: ({ color, size }) => {
                        if (route.name === "Home") {
                            return (
                                <Ionicons
                                    name="ios-home"
                                    size={size}
                                    color={color}
                                />
                            );
                        } else if (route.name === "Music") {
                            return (
                                <Ionicons
                                    name="ios-musical-note"
                                    size={size}
                                    color={color}
                                />
                            );
                        } else if (route.name === "Artist") {
                            return (
                                <Ionicons
                                    name="ios-person"
                                    size={size}
                                    color={color}
                                />
                            );
                        }
                    },
                    tabBarHideOnKeyboard: true,
                    tabBarActiveTintColor: "#66fcf1",
                    tabBarInactiveTintColor: "#c5c6c7",
                })}
            >
                <Tab.Screen
                    options={{ headerShown: false }}
                    name="Home"
                    component={Home}
                />
                <Tab.Screen
                    options={{ headerShown: false }}
                    name="Music"
                    component={Music}
                />
                <Tab.Screen
                    options={{ headerShown: false }}
                    name="Artist"
                    component={Artist}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default App;
