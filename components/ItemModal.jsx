import { Modal, TouchableOpacity, View, Text, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Divider, SegmentedButtons } from "react-native-paper";
import { useState, useEffect } from "react";
import { openDialog } from "../utils";

import ListItem from "./ListItem";

export default function ItemModal({
  modalVisible,
  setModalVisible,
  scans,
  updateList,
  setCodeFoundDialogVisible,
  setCodeFoundDialogData,
}) {
  let [currentValue, setCurrentValue] = useState("QR");
  let [filteredList, setFilteredList] = useState(
    scans.filter(x=>x.type === "QR")
  );


  useEffect(()=>{
    let filtered = scans.filter(x=>x.type == currentValue);
    setFilteredList(filtered);
  },[scans])


  return (
    <Modal animationType="slide" visible={modalVisible}>
      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <MaterialCommunityIcons name="window-close" size={40} color="black" />
      </TouchableOpacity>
      <View
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SegmentedButtons
          style={{
            width: "80%",
            marginTop: 10,
          }}
          value={currentValue}
          onValueChange={(value) => {
            let filtered = scans.filter(x=>x.type == value);
            setCurrentValue(value);
            setFilteredList(filtered);
          }}
          buttons={[
            {
              value: "QR",
              label: "QR-CODE",
            },
            {
              value: "BC",
              label: "BARCODE",
            },
          ]}
        />
      </View>
      <FlatList
          data={filteredList}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => {
            return (
              <>
                <ListItem
                  x={item}
                  updateList={updateList}
                  onPress={() => {
                    setModalVisible(false);
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
                <Divider />
              </>
            );
          }}
        />
    </Modal>
  );
}
