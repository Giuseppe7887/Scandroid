import { Dialog, Button } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function CodeFoundDialog({ visible, hideDialog, data }) {
  return (
    <Dialog visible={visible}>
      <Dialog.Title
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Text style={{ fontSize: 25 }}>{data?.title}</Text>
        <Text> </Text>
          {data?.headerIcon != null && React.createElement(data?.headerIcon)}
      </Dialog.Title>

      <Dialog.Content
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 25, marginRight: 10 }}>{data?.body}</Text>
        {data?.icon != null && React.createElement(data?.icon)}
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={hideDialog}>
          <Text style={{ color: "rgba(200,0,0,0.7)" }}>Chiudi</Text>
        </Button>
        {data?.action && (
          <Button onPress={data?.action.onPress}>{data?.action.title}</Button>
        )}
      </Dialog.Actions>
    </Dialog>
  );
}
