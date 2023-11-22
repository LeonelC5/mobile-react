import React, { useState } from "react";
import { Button, View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import axios from "axios";
//subida 
const AddReservationScreen = () => {
  const initialReservationState = {
    nombre: "",
    telefono: "",
    fechainicio: "",
    fechaFin: "",
    formapago: "",
  };

  const initialMascotaState = {
    nombreMascota: "",
    tipo: "",
    edad: "",
    cantidad: "",
    foto: "",
  };

  const [reservation, setReservation] = useState(initialReservationState);
  const [mascota, setMascota] = useState(initialMascotaState);
  const [currentStep, setCurrentStep] = useState(1);
  const handleChangeText = (value, name) => {
    setReservation({ ...reservation, [name]: value });
  };

  const handleChangeMascotaText = (value, name) => {
    setMascota({ ...mascota, [name]: value });
  };

  const saveReservation = () => {
    setCurrentStep(2);
  };

  const saveNewReservation = async () => {
    try {
      // Realizar la solicitud para guardar la reserva
      const response = await axios.post("https://proyecto32-production.up.railway.app/reservas", reservation);
      console.log("Respuesta de la API (Reserva):", response.data);

      // Puedes hacer algo con la respuesta si es necesario

      // Restablecer el estado después de enviar la solicitud
      setReservation(initialReservationState);

      // Luego, guardar la mascota asociada a la reserva
      const idReserva = response.data.id; // Asumiendo que la API devuelve un ID de reserva
      await axios.post(`https://proyecto32-production.up.railway.app/mascotas/${idReserva}`, mascota);
      console.log("Mascota asociada guardada con éxito");

      // Restablecer el estado de la mascota después de enviar la solicitud
      setMascota(initialMascotaState);

      // Mostrar un mensaje de éxito
      Alert.alert("Reserva y mascota guardadas con éxito");

      // Regresar al paso 1
      setCurrentStep(1);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      Alert.alert("Error al guardar la reserva y mascota");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {currentStep === 1 && (
        <>
          {/* Campos para la reserva */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Nombre"
              onChangeText={(value) => handleChangeText(value, "nombre")}
              value={reservation.nombre}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Teléfono"
              onChangeText={(value) => handleChangeText(value, "telefono")}
              value={reservation.telefono}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Fecha de Inicio"
              onChangeText={(value) => handleChangeText(value, "fechainicio")}
              value={reservation.fechainicio}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Fecha de Fin"
              onChangeText={(value) => handleChangeText(value, "fechaFin")}
              value={reservation.fechaFin}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Forma de Pago"
              onChangeText={(value) => handleChangeText(value, "formapago")}
              value={reservation.formapago}
            />
          </View>
          <View style={styles.button}>
            <Button title="Siguiente" onPress={saveReservation} />
          </View>
        </>
      )}

      {currentStep === 2 && (
        <>
          {/* Campos para la mascota */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Nombre de la mascota"
              onChangeText={(value) => handleChangeMascotaText(value, "nombreMascota")}
              value={mascota.nombreMascota}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Tipo de mascota"
              onChangeText={(value) => handleChangeMascotaText(value, "tipo")}
              value={mascota.tipo}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Edad de la mascota"
              onChangeText={(value) => handleChangeMascotaText(value, "edad")}
              value={mascota.edad}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Cantidad de mascotas"
              onChangeText={(value) => handleChangeMascotaText(value, "cantidad")}
              value={mascota.cantidad}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              placeholder="Foto de la mascota"
              onChangeText={(value) => handleChangeMascotaText(value, "foto")}
              value={mascota.foto}
            />
          </View>
          <View style={styles.button}>
            <Button title="Guardar Reserva y Mascota" onPress={saveNewReservation} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  button: {
    marginTop: 15,
  },
});

export default AddReservationScreen;
