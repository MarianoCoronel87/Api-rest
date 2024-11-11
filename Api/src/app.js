import express from "express";
const  app = express();
const PORT = 80800;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerIngredientes);
app.use((req, res) => {  
    res.status(404).json({ error: 'Ruta no encontrada.' });  
});  

// Iniciar el servidor  
app.listen(PORT, () => {  
    console.log(`Servidor escuchando en el puerto ${PORT}`);  
});  