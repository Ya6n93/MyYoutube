<template>
  <div>
    <div>{{ error }}</div>
    <div>
      <h1>Inscription</h1>
      <input type="text" v-model="username" placeholder="Username" />
      <input type="email" v-model="email" placeholder="Email" />
      <input type="text" v-model="pseudo" placeholder="Pseudo" />
      <input type="password" v-model="password" placeholder="Password" />
      <button v-on:click="register">Valider</button>
      {{ success ? "Vous vous êtes inscris" : "" }}
    </div>
    <h1>Connexion</h1>
    <div>
      <input type="text" v-model="userCo" placeholder="Email" />
      <input type="password" v-model="passwordCo" placeholder="Password" />

      <button v-on:click="login">Valider</button>
      {{ connected ? "Vous vous êtes connecté" : "" }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      email: "",
      pseudo: "",
      password: "",
      error: "",
      success: false,
      userCo: "",
      passwordCo: "",
      connected: false
    };
  },

  methods: {
    register: function() {
      axios
        .post(`http://localhost:5001/user`, {
          username: this.username,
          email: this.email,
          pseudo: this.pseudo,
          password: this.password
        })
        .then(response => {
          this.success = true;
        })
        .catch(e => {
          console.log(e);
        });
    },
    login: function() {
      axios
        .post(`http://localhost:5001/auth`, {
          login: this.userCo,
          password: this.passwordCo
        })
        .then(response => {
          this.connected = true;
          this.$store.commit("userStore/token", response.data);
          this.$router.push("/home");
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
