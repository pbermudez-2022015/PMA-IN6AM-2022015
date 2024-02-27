'use strict'
import Appointment from './appointment.model.js'
import Animal from '../animal/animal.model.js'

export const save = async(req, res) =>{
    try{
        //Capturar la data
        let data = req.body
        data.user = req.user._id//jalar el id del user logeado!!
        //Verificar que exista el animal
        let animal = await Animal.findOne({_id: data.animal})
        if(!animal) return res.status(404).send({message: 'Animal not found 😒'})
        //Validar que la mascota NO tenga una cita activa con su persona
        let existAppointment = await Appointment.findOne({
            $or: [
            {
                animal: data.animal,
                user: data.user
            },
            {
                date: data.date,
                user: data.user
            }
            ]
            

            
        })
        //EJERCICIO: EL USUARIO SOLO PUEDA TENER UNA CITA POR DIA
        //Guardar
        if(existAppointment) return res.send({message: 'Appointment already exist'})
        let appointment = new Appointment(data)
        await appointment.save()
        return res.send({message: `Appointment saved succesfully 😊! for the date ${appointment.date}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error creating appointment', err})
    }
}