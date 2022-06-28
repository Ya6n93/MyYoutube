<template>
  <div>
    <p>Hello world</p>
    <h1>Modifier ses informations</h1>
    <label>Username</label>
    <input type="text" v-model="username" value="username" />

    <label>Pseudo</label>
    <input type="text" v-model="pseudo" />

    <label>Email</label>
    <input type="text" v-model="email" />

    <label>Password</label>
    <input type="password" v-model="password" />
    <button v-on:click="allUser">Modifier</button>

    <h1>Ajouter une vidéo</h1>
    <input type="text" placeholder="nom de la video" v-model="videoName" />

    <label>
      File
      <input type="file" id="file" ref="file" v-on:change="handleFileUpload" />
    </label>
    <button v-on:click="submitFile">Ajouter une vidéo</button>
    <div>
      <button v-on:click="getVideo">Voir les vidéos</button>
      <label for="vid">Nombre de vidéo</label>
      <input type="number" id="vid" v-model="nbrVideo" value="nbrVideo" min="1" />
      <div v-if="allVideo.length > 0">
        <ul id="1">
          <li v-for="item in allVideo" :key="item.id">
            {{ item.id }} - {{ item.source }} - Nom de la vidéo :
            {{ item.name }}
            <button
              v-on:click="deleteVideo(item.id)"
            >Supprimer</button>
            <button v-on:click="getComments(item.id)">Commentaire</button>
            <input type="text" v-model="comments" />
            <button v-on:click="addComments(item.id)">Ajouter un commentaire</button>
            <input type="text" v-model="nameVideo" />
            <button v-on:click="changeName(item.id)">Changer nom</button>
            <label for="comment">Nombre de commentaire</label>
            <input type="number" id="comment" v-model="nbrComments" value="nbrComments" min="1" />
          </li>
        </ul>
      </div>
      <div v-else>Aucune vidéo</div>
      <div v-if="allComments.length > 0">
        <li v-for="commentaire in allComments" :key="commentaire.id">
          {{ commentaire.id }} - {{ commentaire.body }} : Pseudo :
          {{ commentaire.user.pseudo }} et Username :
          {{ commentaire.user.username }}
        </li>
      </div>
      <div v-else>Aucun commentaire</div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      file: "",
      videoName: "",
      allVideo: [],
      allComments: [],
      comments: "",
      search: "",
      searchVideo: [],
      nameVideo: "",
      nbrComments: 1,
      nbrVideo: 1,
      username: this.$store.state.userStore.user[0].data.user.username,
      pseudo: this.$store.state.userStore.user[0].data.user.pseudo,
      email: this.$store.state.userStore.user[0].data.user.email,
      password: "",
    };
  },
  methods: {
    allUser: function () {
      let body = {
        username: this.username,
        pseudo: this.pseudo,
        email: this.email,
      };
      if (this.password.length > 0) body.password = this.password;
      axios
        .put(
          "http://localhost:5001/user/" +
            this.$store.state.userStore.user[0].data.user.id,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: this.$store.state.userStore.user[0].data.token,
            },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    changeName: function (id) {
      axios
        .put(
          "http://localhost:5001/video/" + id,
          {
            name: this.nameVideo,
            user: this.$store.state.userStore.user[0].data.user.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: this.$store.state.userStore.user[0].data.token,
            },
          }
        )
        .then((res) => {
          this.getComments(id);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    addComments: function (id) {
      axios
        .post(
          "http://localhost:5001/video/" + id + "/comment",
          {
            body: this.comments,
            user: this.$store.state.userStore.user[0].data.user.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: this.$store.state.userStore.user[0].data.token,
            },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getComments: function (id) {
      axios
        .post(
          "http://localhost:5001/video/" + id + "/comments",
          {
            page: 1,
            perPage: this.nbrComments,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: this.$store.state.userStore.user[0].data.token,
            },
          }
        )
        .then((res) => {
          this.allComments = res.data.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deleteVideo: function (id) {
      axios
        .delete("http://localhost:5001/video/" + id, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: this.$store.state.userStore.user[0].data.token,
          },
        })
        .then((res) => {
          this.getVideo();
          this.allComments = [];
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getVideo: function () {
      axios
        .post(
          "http://localhost:5001/user/" +
            this.$store.state.userStore.user[0].data.user.id +
            "/videos",
          {
            page: 1,
            perPage: this.nbrVideo,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: this.$store.state.userStore.user[0].data.token,
            },
          }
        )
        .then((res) => {
          this.allVideo = res.data.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleFileUpload: function () {
      this.file = this.$refs.file.files[0];
    },
    submitFile: function () {
      let formData = new FormData();
      formData.append("source", this.file);
      formData.append("name", this.videoName);
      axios
        .post(
          "http://localhost:5001/user/" +
            this.$store.state.userStore.user[0].data.user.id +
            "/video",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
              Authorization: this.$store.state.userStore.user[0].data.token,
            },
          }
        )
        .then(function () {
          console.log("SUCCESS!!");
        })
        .catch(function () {
          console.log("FAILURE!!");
        });
    },
  },
  name: "home",
};
</script>

<style scoped></style>
