import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, DrawerLayoutAndroid  } from 'react-native';
import axios from 'axios';
import { REACT_APP_BACKEND_URL } from '@env';
//prop navegación entre pantallas.

const HomeScreen = ({ navigation })  => {
//se  utilizan los Hoocks
    const [originalData, setOriginalData] = useState(null);
    const [data, setData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState('');
const handleAdd = (element) => {
      // Implementa la navegación a tu pantalla deseada 
      navigation.navigate('Reservas',{imageData:element});
    };
  //se utiliza el hoocks useEffect para obtener los datos
    useEffect(() => {
    const fetchData = async () => {
        try {
        const lugares = REACT_APP_BACKEND_URL + "lugares";
        console.log('URL del backend:', lugares);
        const response = await axios.get(lugares);//metodo get y se actualizan los estados
        console.log('Response from the backend:', response.data);
        setData(response.data);
        setOriginalData(response.data);
        } catch (error) {
        console.error('Error:', error);
        }
    };

    fetchData();
    }, []);
//seimplementa la paginacion sobre cuanto habra en cada pagina
    const itemsPerPage = 3;
    const paginate = (array, pageSize, pageNumber) => {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    };

  //Para actualizar el estado de currentPage cuando se cambia de pagina
    const handlePageChange = (page) => {
    setCurrentPage(page);
    };

    const handleSearch = () => {
        // Filtrar los resultados basados en el nombre
        //Actualiza los estados data y currentPage después de la búsqueda.
        const filteredData = originalData.filter((element) =>
          element.nombre.toLowerCase().includes(searchText.toLowerCase())
        );
        setData(filteredData);
        setCurrentPage(1); 
      };
    
    const drawerRef = React.createRef();
    const navigationView = (
        <View style={styles.drawerContainer}>
          <TouchableOpacity onPress={() => console.log('Go to Ratings')}>
            <Text style={styles.drawerItem}>Ratings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Go to Favorites')}>
            <Text style={styles.drawerItem}>Favorites</Text>
          </TouchableOpacity>
        </View>
      );
      //Se utiliza el método map para renderizar cada elemento de la lista
      return (
        <DrawerLayoutAndroid
            ref={drawerRef}
            drawerWidth={200}
            drawerPosition="left"
            renderNavigationView={() => navigationView}
        >
            <View style={styles.container}>
                <View style={styles.searchContainer}>

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name..."
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text>Search</Text>
                    </TouchableOpacity>
                </View>
                {data && data.length > 0 ? (
                    <View style={styles.imageContainer}>
                        {paginate(data, itemsPerPage, currentPage).map((element, index) => (
                            <View key={index} style={styles.imageFrame}>
                                {typeof element.fotos === 'string' ? (
 <TouchableOpacity onPress={() => handleAdd(element)}>
 <Image style={styles.image} source={{ uri: element.fotos }} />
</TouchableOpacity>                                ) : (
                                    <View style={styles.errorContainer}>
                                        <Text style={styles.errorText}>Invalid Image URL</Text>
                                    </View>
                                )}
                                <View style={styles.imageDetails}>
                                    <Text style={styles.attributeText}>{`Rating: ${element.rating}`}</Text>
                                    <Text style={styles.attributeText}>{`Name: ${element.nombre}`}</Text>
                                    <Text style={styles.attributeText}>{`Address: ${element.direccion}`}</Text>
                                    <Text style={styles.attributeText}>{`Phone: ${element.telefono}`}</Text>
                                    <TouchableOpacity style={styles.addButton} onPress={() => handleAdd()}>
                    <Text style={styles.addButtonText}>Reserva</Text>
                  </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                        <View style={styles.paginationContainer}>
                            <TouchableOpacity
                                style={styles.paginationButton}
                                onPress={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                            >
                                <Text>First</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.paginationButton}
                                onPress={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <Text>Previous</Text>
                            </TouchableOpacity>
                            <Text>Page {currentPage}</Text>
                            <TouchableOpacity
                                style={styles.paginationButton}
                                onPress={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage * itemsPerPage >= data.length}
                            >
                                <Text>Next</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.paginationButton}
                                onPress={() => handlePageChange(Math.ceil(data.length / itemsPerPage))}
                                disabled={currentPage * itemsPerPage >= data.length}
                            >
                                <Text>Last</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <Text>No data available</Text>
                )}
            </View>
        </DrawerLayoutAndroid>
    );
    
    
    
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: 10,
    },
    menuButton: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    drawerContainer: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
    drawerItem: {
      fontSize: 18,
      marginBottom: 10,
    },
    searchContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      margin: 10,
      alignItems: 'center',
    },
    searchInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginRight: 10,
      padding: 5,
      flex: 1,
    },
    searchButton: {
      padding: 10,
      backgroundColor: '#eee',
      borderRadius: 5,
    },
    imageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 5,
    },
    image: {
      width: 100,
      height: 100,
      margin: 5,
    },
    imageText: {
      fontSize: 16,
      marginTop: 5,
    },
    paginationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    paginationButton: {
      padding: 10,
      marginHorizontal: 5,
      backgroundColor: '#eee',
      borderRadius: 5,
    },
    imageFrame: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
  },
  image: {
      width: 100,
      height: 100,
      margin: 5,
  },
  imageDetails: {
      flex: 1,
      marginLeft: 10,
  },
  attributeText: {
      fontSize: 16,
      marginBottom: 5,
  },
  addButton: {
    padding: 5,
    backgroundColor: 'blue',  // Puedes personalizar el color
    borderRadius: 5,
    marginRight: 5,
  },
  addButtonText: {
    color: 'white',  // Puedes personalizar el color del texto
    fontSize: 10,
    fontWeight: 'bold',
  },
  });
  export default HomeScreen;
