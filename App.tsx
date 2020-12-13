import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
// import LoginScreen from "./src/screens/LoginScreen";
import {Asset} from "expo-asset";
import AppLoading from "expo-app-loading";
import LoginScreen from "./src/screens/LoginScreen";

async function cacheImages(){
  const images: string[] | number[] = [
      require("./assets/main.jpg"),
    require("./assets/close.png")
  ];

  const cacheImages: Promise<Asset>[] = images.map((image: string | number) => {
    return Asset.fromModule(image).downloadAsync();
  });
  return Promise.all(cacheImages);
}


export default function App() {
  const [isReady, setIsReady] = useState(false);


  if(!isReady) return <AppLoading startAsync={cacheImages}
                                  onFinish={() => setIsReady(true)}
                                  onError={(e) => console.log(e)}
                                  />

  return (
      <LoginScreen/>
  );
}


