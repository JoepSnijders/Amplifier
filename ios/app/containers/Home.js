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
var globalStyles = require('../stylesheets');

class Home extends Component {
  constructor(props){
    super(props);
    this.state = { searchInput: '', searching: false};
  }
  searchPressed() {
    console.log('searching..');
    this.setState({searching: true});
    this.props.fetchRecipes(this.state.searchInput).then(() => {
      this.setState({searching: false});
    });
  }
  recipes() {
    return Object.keys(this.props.searchedRecipes).map(key => this.props.searchedRecipes[key]);
  }
  componentDidMount() {
    this.searchPressed();
  }
  render() {
    return <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <TextInput
          style={styles.searchSectionInput}
          placeholder="Search for bands near..."
          returnKeyType="search"
          onBlur={() => this.searchPressed()}
          onChangeText={(searchInput)=> this.setState({searchInput})}
          value={this.state.searchInput}
          />
        <TouchableHighlight style={styles.fetchButton} onPress={() => this.searchPressed()}>
          <Text style={styles.searchSectionButton}>Search</Text>
        </TouchableHighlight>
      </View>
      <ScrollView>
        {this.props.recipeCount !== 0 ? <Text style={styles.bandInTown}>BREWDOG CRAFT BEER</Text> : null}
        {!this.state.searching && !this.props.recipeError && this.recipes().map((recipe) => {
          return <TouchableOpacity style={styles.band} key={recipe.id} onPress={() => {
              this.props.navigate({ key: 'Detail', id: recipe.id})
            }}>
            <View>
              <Text style={styles.date}>{recipe.first_brewed}</Text>
              <Text style={styles.title}>{recipe.name}</Text>
              <Text>{recipe.tagline}</Text>
            </View>
          </TouchableOpacity>
        })}
        {this.state.searching ? <Text style={styles.searching}>Searching..</Text> : null}
        {this.props.recipeError == true && !this.state.searching ? <Text style={styles.searching}>Connection Error.</Text> : null}
      </ScrollView>
    </View>
  }
}

var styles = StyleSheet.create({
  searchSectionInput: {
    flex: 0.7,
    color: '#353535',
    marginTop: 20,
  },
  fetchButton: {
    flex: 0.2,
    borderWidth: 1,
    borderColor: "#00A0F3",
    backgroundColor: "#00A0F3",
    borderRadius: 4,
    height: 30,
    paddingTop: 5,
    marginTop: 30,
  },
  searchSectionButton: {
    color: 'white',
    textAlign: 'center',

  },
  bandInTown: {
    fontSize: 10,
    marginTop: 10,
    paddingLeft: 10,
    color: '#7C7C7C',

  },
  band: {
    flex: 0.8,
    padding: 10,
    backgroundColor: "white",
    marginTop: 10,
  },
  title: {
    fontSize: 18,

  },
  date: {
    fontSize: 10,
    color: '#D6D6D6',
    marginBottom: 5,
  },
  searching: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,

    marginTop: 120,
  }
})

function mapStateToProps(state) {
  return {
    searchedRecipes: state.searchedRecipes,
    recipeCount: state.recipeCount,
    recipeError: state.recipeError,
  }
}

export default connect(mapStateToProps)(Home);
