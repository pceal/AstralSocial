
const Comment = require("../models/Comment");


const CommentController = {
    async create(req, res) {
        try {
            const comment = await Comment.create(req.body)
            // faltaria relacion 
           // userId: req.body._Id,
            res.status(201).send(comment)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al crear el comentario' })
        }
    },
    async getAll(req, res) {
        try {
            const comments = await Comment.find()
            res.send(comments)
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al traer los comentarios' })
        }
    },
     async update(req, res) {
        try {
            const comment = await Comment.findByIdAndUpdate(req.params._id, req.body, { new: true })
            res.send({ message: "Comentario actualizado correctamente", comment });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Ha habido un problema al actualizar el comentario' })

        }
    },
    async delete(req, res) {
        try {
            const comment = await Comment.findByIdAndDelete(req.params._id)
            res.send({ message: 'Comentario eliminado', comment })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'Ha habido un problema al eliminar el comentario' })
        }
    },
};


module.exports = CommentController;