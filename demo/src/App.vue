<template>
    <div id="app">
        <keep-alive>
            <router-view/>
        </keep-alive>
    </div>
</template>
<style lang="stylus">
    @import "assets/css/app.styl";
</style>
<script>
    export default {
        name: 'App'
    }
</script>
