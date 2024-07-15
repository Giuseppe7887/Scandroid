import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Camera } from 'expo-camera';

import { useState, useEffect } from 'react';


// components
import NeedPermission from './components/NeedPermission';
import Main from './Main';



export default function App() {

  let [permissionGranted, setPermissionGranted] = useState(false);

  async function getPermission() {
    if (!(await Camera.getCameraPermissionsAsync()).granted) {

      await Camera.requestCameraPermissionsAsync().then(response => {
        if (!response.granted) {
          getPermission();
        } else {
          setPermissionGranted(true);
        }
      })

    } else {
      setPermissionGranted(true);
    }
  }


  useEffect(() => {
    getPermission()
    // setPermissionGranted(false)
  }, [])

  return (
    <PaperProvider>
      <View style={styles.main}>
        {
          permissionGranted ? <Main /> : <NeedPermission />
        }

        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: "100%"
  },
});

