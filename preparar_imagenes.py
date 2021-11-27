import os 
import cv2
import numpy as np

# Cambiar esta URL
url_git = "C:/Users/Usuario/Documents/SIAFI/GANs/git/michiGAN"

# 
carpetas = os.listdir(os.path.join(url_git,"imagenes"))

for carpeta in carpetas:
    url_carpeta_origen = os.path.join(url_git,"imagenes",carpeta)
    url_carpeta_destino = os.path.join(url_git,"imagenesListas",carpeta)
    if not os.path.exists(url_carpeta_destino):
        os.mkdir(url_carpeta_destino)
        for archivo in os.listdir(url_carpeta_origen):
            img = cv2.imread(os.path.join(url_carpeta_origen,archivo))
            img = img[:,:,:3]
            res = cv2.resize(img, dsize=(128, 128), interpolation=cv2.INTER_CUBIC)
            nombre = archivo.split(".")[0]
            nombre = nombre+".png"
            cv2.imwrite(os.path.join(url_carpeta_destino,nombre), res)
        