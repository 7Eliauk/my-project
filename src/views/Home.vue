<template>
  <div class="home-container">
    <h1>欢迎来到智膳坊！</h1>
    <p>这是您的个人主页</p>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: white;
  text-align: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

p {
  font-size: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>