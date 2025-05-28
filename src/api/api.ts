import axios, { type AxiosResponse } from "axios";
import type { Product, Category } from "../types/types";

const apiClient = axios.create({
  baseURL: 'https://fakestoreapi.com'
})
// This initializes an Axios client with a base URL for the Fake Store API, providing a convenient way to make HTTP requests.

// fetchProducts
export const fetchProducts = (): Promise<AxiosResponse<Product[]>> => apiClient.get<Product[]>('/products')
// This function sends a GET request to the `/products` endpoint of the Fake Store API to fetch a list of all products. 
// It returns a Promise that resolves to an AxiosResponse containing an array of `Product` objects.

// fetchCategories
export const fetchCategories = (): Promise<AxiosResponse<Category[]>> => apiClient.get<Category[]>('/products/categories')
// This function sends a GET request to the `/products/categories` endpoint of the Fake Store API to retrieve a list of all available product categories. 
// It returns a Promise that resolves to an AxiosResponse containing an array of `Category` (string) objects.