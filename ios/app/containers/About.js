import React, { Component } from 'react';
import ReactNative from 'react-native';
const {
  ScrollView,
  View,
  TextInput,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Text
} = ReactNative;
import { connect } from 'react-redux';

export default class About extends Component {
  render() {
    return <View style={styles.container}>
      <ScrollView>
        <Text>About</Text>
      </ScrollView>
    </View>
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F5",
  }
});
