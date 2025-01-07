Esta es una aplicación web en Flask-Next.js y el modelo open-source de Ollama Qwen2.5 con 1.5 billones de parámetros el cual se corre en el host local (localhost) con la CPU del dispositivo de cómputo en el que se quiera correr esta aplicación. LA APLICACIÓN ESTÁ DOCKERIZADA. Creé el bot relativamente desde cero, creé la interfaz del webchat y utilicé el modelo Qwen2.5:1.5b como LLM que corre localmente, entrené el modelo del sistema de recomendaciones desde el backend en Python y los resultados que comparte los inyecto como contexto al modelo LLM de Qwen2.5:1.5b, de esta manera TODA la aplicación esta construida sobre recursos open-source *wink*.

RECOMENDACIONES:
 ⚠️ Tener una CPU de 8GB mínimo para que las respuestas del modelo LLM de OLLAMA se produzcan sin tanta lentitud ya que la eficiencia y rapidez en ejecución del modelo depende de la máquina del usuario que corre la aplicación. REALMENTE RECUERDA QUE LA RAPIDEZ DEPENDE ENTERAMENTE DE TU MÁQUINA❗ ❗ ❗ ❗

PRECAUCIONES LOL:
 ⚠️ El modelo LLM solo tien 1.5b de parámetros, gpt-3.5-turbo tiene 175b así que si el modelo no da respuestas adecuadas, confusas o incluso fuera de contexto puede ser por esto así que utilice el modelo con precaución. Utilicé este modelo porque es open-source y no necesita de un servidor de 500GB para correr.
 
## Para correr la aplicación

1. Clonar este repositorio.
Clonar este repositorio.


2. Instalar [Docker](https://www.docker.com/products/docker-desktop) y [Docker Compose](https://docs.docker.com/compose/) en tu PC.

3. Antes de correr los contenedores, dentro del directorio del proyecto haz un "pull" del modelo    LLM de Qwen2.5:1.5b con este comando: 🚨 ollama pull qwen2.5:1.5b 🚨. Esto "arrastrará" el modelo dentro de la imagen de Ollama Docker.

3. De nuevo, dentro del directorio del proyecto, ejecutar el comando:
🚨 docker compose up -d --build 🚨. Este comando deberá crear los contenedores de los servicios del backend y frontend, además del contenedor del modelo LLM de Ollama.

4. Ingresar a [localhost:3000](http://localhost:3000) en su navegador web. El backend en el puerto [localhost:5000](http://localhost:5000) está configurado para conectarse automáticamente a Ollama a través de la URL `http://ollama:11434`, que es accesible dentro de los contenedores de Docker. 

5. La aplicación debería de funcionar en ese punto. 👌

🚨🚨🚨🚨🚨 AL CORRER LA OTRA APLICACIÓN RECUERDA ELIMINAR TODOS LOS CONTENEDORES PORQUE TODOS ESTAN CORRIENDO EN LOS MISMOS PUERTOS.