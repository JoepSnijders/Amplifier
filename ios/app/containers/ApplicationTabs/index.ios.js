import { View, TabBarIOS, TabBarItemIOS } from 'react-native';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from '../../actions';
import Home from '../Home';
import About from '../About';

class ApplicationTabs extends Component {
  constructor(props){
    super(props);
    this.state = { index: 0 }
  }
  onPress(tabIndex) {
    this.props.setTab(tabIndex);
  }
  renderScene(component){
    return (
      <View style={{flex: 1}}>
        { React.createElement(component, this.props) }
      </View>
    )
  }
 render() {
   return <TabBarIOS style={{flex: 1, borderColor: 'white'}} barTintColor="white">
    <TabBarIOS.Item
      systemIcon="favorites"
      onPress={ () => { return this.onPress(0); }}
      iconSize={25}
      selected={this.props.tabs.index === 0}>
      { this.renderScene(Home)}
    </TabBarIOS.Item>
    <TabBarIOS.Item
      systemIcon="more"
      onPress={ () => { return this.onPress(1); }}
      iconSize={25}
      selected={this.props.tabs.index === 1}>
      { this.renderScene(About)}
    </TabBarIOS.Item>
   </TabBarIOS>
 }
}

// Access State in Props
function mapStateToProps(state){
  return {
    tabs: state.tabs
  }
}
// Access Actions in Props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(ApplicationTabs);
