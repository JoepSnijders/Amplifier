import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
var globalStyles = require('../stylesheets');
const {
  ScrollView,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Text
} = ReactNative;


class Detail extends Component {
  recipe() {
    return this.props.searchedRecipes[this.props.navigationParams.id] || null;
  }
  render() {
    const recipe = this.recipe();
    if (!recipe) { return null; }
    return <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TouchableOpacity style={styles.back} onPress={() => {
          this.props.navigateBack();
        }}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.city}>{recipe.first_brewed}</Text>
          <Text style={styles.name}>{recipe.name}</Text>
          <Text style={styles.city}>{recipe.tagline}</Text>
          <Text style={styles.bio}>{recipe.description}</Text>
        </View>
      </ScrollView>
    </View>
  }
}

var styles = StyleSheet.create({

  back: {
    height: 20,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  backText: {
    color: 'blue',
    paddingVertical: 15
  },
  card: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  city: {
    fontSize: 12,
    marginBottom: 10,
  },
  bio: {
    fontSize: 12,
    marginTop: 20,
  }
});

// Access State in Props
function mapStateToProps(state) {
  return {
    searchedRecipes: state.searchedRecipes,
    navigationParams: state.navigationParams
  }
}
// Access Actions in Props
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
