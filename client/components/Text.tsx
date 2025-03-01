import { StyleSheet, Text as RNText, TextProps } from "react-native";
import React from "react";

const Text = (props: TextProps) => {
  return <RNText allowFontScaling={false} {...props} />;
};

export default Text;

const styles = StyleSheet.create({});
