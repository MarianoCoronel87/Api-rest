import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile, deleteFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";

export default class ProductosManager {
    #jsonFilename;
    #Productos;

    constructor() {
        this.#jsonFilename = "Productos.json";
    }

    // Busca un Producto por su ID
    async #findOneById(id) {
        this.#Productos = await this.getAll();
        const ProductoFound = this.#Productos.find((item) => item.id === Number(id));

        if (!ProductoFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return ProductoFound;
    }

    // Obtiene una lista de Productos
    async getAll() {
        try {
            this.#Productos = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#Productos;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Obtiene un Producto específico por su ID
    async getOneById(id) {
        try {
            const ProductoFound = await this.#findOneById(id);
            return ProductoFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Inserta un Producto
    async insertOne(data, file) {
        try {
            const { title, status, stock } = data;

            if (!title || !status || !stock ) {
                throw new ErrorManager("Faltan datos obligatorios", 400);
            }

            if (!file?.filename) {
                throw new ErrorManager("Falta el archivo de la imagen", 400);
            }

            const producto = {
                id: generateId(await this.getAll()),
                title,
                description,
                code,
                status: convertToBoolean(status),
                stock: Number(stock),
                category,
                thumbnail: file?.filename,
            };

            this.#Productos.push(producto);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#Productos);

            return producto;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename); // Elimina la imagen si ocurre un error
            throw new ErrorManager(error.message, error.code);
        }
    }

    // Actualiza un Producto en específico
    async updateOneById(id, data, files) {
        try {
            const { title, description, code, price, status, stock, category } = data;
            const ProductoFound = await this.#findOneById(id);
            const newThumbnails = files?.map(file => file.filename) || ProductoFound.thumbnails;
            const producto = {
                id: ProductoFound.id,
                title: title || ProductoFound.title,
                description: description || ProductoFound.description,
                code: code || ProductoFound.code,
                price: price !== undefined ? Number(price) : ProductoFound.price,
                status: status !== undefined ? convertToBoolean(status) : ProductoFound.status,
                stock: stock !== undefined ? Number(stock) : ProductoFound.stock,
                category: category || ProductoFound.category,
                thumbnails: newThumbnails.length > 0 ? newThumbnails : ProductoFound.thumbnails,
            };
            const index = this.#Productos.findIndex((item) => item.id === Number(id));
            this.#Productos[index] = producto;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#Productos);
            // Elimina las imágenes anteriores si han sido actualizadas
            if (files && newThumbnails !== ProductoFound.thumbnails) {
                ProductoFound.thumbnails.forEach(async (thumbnail) => {
                    if (!newThumbnails.includes(thumbnail)) {
                        await deleteFile(paths.images, thumbnail);
                    }
                });
            }
            return producto;
        } catch (error) {
            if (files) {
                files.forEach(async (file) => {
                    await deleteFile(paths.images, file.filename);
                });
            }
            throw new ErrorManager(error.message, error.code);
        }
    }
    // Elimina un Producto en específico
    async deleteOneById (id) {
        try {
            const ProductoFound = await this.#findOneById(id);

            // Si tiene thumbnail definido, entonces, elimina la imagen del Producto
            if (ProductoFound.thumbnail) {
                await deleteFile(paths.images, Producto.thumbnail);
            }

            const index = this.#Productos.findIndex((item) => item.id === Number(id));
            this.#Productos.splice(index, 1);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#Productos);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}