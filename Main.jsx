import "react-native-get-random-values";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { CameraView } from "expo-camera";

import { useState, useEffect } from "react";

import CodeFoundDialog from "./components/CodeFoundDialog";

import { v4 as uuid } from "uuid";

import { openDialog, save, getFaviconAndTitle, getAll } from "./utils";

import ItemModal from "./components/ItemModal";
import { FontAwesome5 } from "@expo/vector-icons";
import ListItem from "./components/ListItem";

import { Audio } from "expo-av";

import Animated, {
  useSharedValue,
  Easing,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

function Main() {
  let [lastCode, setLastCode] = useState("");
  let [codeFoundDialogVisible, setCodeFoundDialogVisible] = useState(false);
  let [scans, setScans] = useState([]);
  let [modalVisible, setModalVisible] = useState(false);
  let [codeFoundDialogData, setCodeFoundDialogData] = useState({
    title: "",
    body: "",
    action: "",
    icon: "",
  });

  let [beepSound, setBeepSound] = useState(null);
  let [ready, setReady] = useState(false);

  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/beep.mp3")
    );
    setBeepSound(sound);
  }

  function updateList() {
    getAll().then((all) => {
      setScans(all);
    });
  }

  function codeScanned(codeObject) {
    const { data } = codeObject;

    const lastCode = data;

    if (lastCode != "") {
      if (!ready) return;
      setReady(false);
      beep();
      if (
        lastCode.toString().trim().toLocaleLowerCase().startsWith("http") ||
        lastCode.toString().trim().toLocaleLowerCase().startsWith("www")
      ) {
        let qrHistory = scans.map((x) => x.link);
        // qr code

        // -  alert del risultato (modal)
        // - prendere titolo e favicon
        // - salvare la lettura

        getFaviconAndTitle(lastCode).then((response) => {
          openDialog(
            "QR",
            response?.title,
            lastCode,
            setCodeFoundDialogVisible,
            setCodeFoundDialogData,
            response?.favicon
          );
          if (!qrHistory.includes(lastCode)) {
            const id = uuid();
            const model = {
              id: id,
              date: new Date().toLocaleDateString().replaceAll("/", "-"),
              type: "QR",
              favicon: response.favicon.toString(),
              title: response?.title,
              link: lastCode,
            };
            save(id, model);
            updateList();
          }
        });
      } else {
        // barcode
        // setCodeFoundDialogVisible(true);

        let bcHistory = scans.map((x) => x.payload);
        openDialog(
          "BC",
          lastCode,
          lastCode,
          setCodeFoundDialogVisible,
          setCodeFoundDialogData
        );

        if (!bcHistory.includes(lastCode)) {
          const id = uuid();
          const model = {
            id: id,
            date: new Date().toLocaleDateString().replaceAll("/", "-"),
            type: "BC",
            payload: lastCode.toString().trim(),
          };

          save(id, model);
          updateList();
        }
      }
    }
    setTimeout(() => {
      setLastCode("");
      setReady(true);
    }, 3000);
  }

  useEffect(() => {
    setReady(true);
    loadSound();
    updateList();
  }, []);

  async function beep() {
    if (beepSound != null) {
      await beepSound.playAsync();
      loadSound();
    } else {
      loadSound();
      beep();
    }
  }

  // animation
  const config = {
    duration: 500,
    easgin: Easing.bezier(0.5, 0.01, 0, 1),
  };

  let finalSize = useSharedValue(50);

  const dynamicStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(finalSize.value, config),
      height: withTiming(finalSize.value, config),
    };
  });

  useEffect(() => {
    const deviceWidth = Dimensions.get("screen").width;
    const SCANNER_MARGIN = deviceWidth / 4;
    const calculatedSize = deviceWidth - SCANNER_MARGIN;

    // set new size after 1 second
    setTimeout(() => {
      finalSize.value = calculatedSize;
    }, 1000);
  }, []);

  return (
    <View style={styles.main}>
      <CameraView
        onBarcodeScanned={(codeObject) => codeScanned(codeObject)}
        style={styles.camera}
      >
        <Animated.Image
          style={[styles.square, dynamicStyle]}
          source={require("./assets/scanner.png")}
        />
      </CameraView>
      {scans.length > 0 ? (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <FontAwesome5 name="angle-up" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            height: "20%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>Non hai scansioni salvate</Text>
        </View>
      )}
      {scans.length > 0 && (
        <FlatList
          data={scans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ListItem
                x={item}
                updateList={updateList}
                onPress={() => {
                  if (item?.type == "QR") {
                    openDialog(
                      "QR",
                      item?.title,
                      item?.link,
                      setCodeFoundDialogVisible,
                      setCodeFoundDialogData,
                      item?.favicon
                    );
                  } else {
                    openDialog(
                      "BC",
                      item?.payload,
                      item?.payload,
                      setCodeFoundDialogVisible,
                      setCodeFoundDialogData
                    );
                  }
                }}
              />
            );
          }}
        />
      )}
      <CodeFoundDialog
        data={codeFoundDialogData}
        visible={codeFoundDialogVisible}
        hideDialog={() => setCodeFoundDialogVisible((old) => !old)}
      />
      <ItemModal
        scans={scans}
        updateList={updateList}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setCodeFoundDialogData={setCodeFoundDialogData}
        setCodeFoundDialogVisible={setCodeFoundDialogVisible}
      />
    </View>
  );
}

export default Main;

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: "100%",
  },
  camera: {
    width: "100%",
    height: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: 50,
    height: 50,
  },
});
