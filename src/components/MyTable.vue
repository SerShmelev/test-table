<template>
  <div class="page">
    <div class="table-place">
      <div class="search-place">
        <input
          v-model="search"
          v-on:keyup.enter="onSearch"
          class="input"
          placeholder="Поиск"
        />
      </div>
      <table class="table">
        <thead class="table-head">
          <tr>
            <th
              class="column-head"
              v-for="column in columns"
              :key="column.value"
              @click="onHeaderClick(column.value)"
            >
              {{ column.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.fullName" class="table-row">
            <td v-for="column in columns" :key="column.value">
              <div v-if="column.value === 'avatar'">
                <img :src="item[column.value]" />
              </div>
              <div v-else>
                {{ item[column.value] }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <button
          class="navigation-btn"
          :class="{ disabled: prevBtnDisabled }"
          :disabled="prevBtnDisabled"
          @click="toPrevPage"
        >
          {{ "<" }}
        </button>
        <input
          v-model="page"
          v-on:keyup.enter="toPage"
          class="input page-input"
          :class="{error: isErrorPage}"
        />
        <button
          class="navigation-btn"
          :class="{ disabled: nextBtnDisabled }"
          :disabled="nextBtnDisabled"
          @click="toNextPage"
        >
          {{ ">" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyTable",
  watch: {
    currentPage: function (newPage) {
      this.page = newPage;
    },
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    currentPage: {
      type: Number,
      default: 0,
    },
    totalPages: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      page: 0,
      search: "",
      sort: { sortBy: "", sort: "" },
      isErrorPage: false,
    };
  },
  computed: {
    tableData() {
      return this.data;
    },
    prevBtnDisabled() {
      return this.currentPage === 1;
    },
    nextBtnDisabled() {
      return this.currentPage === this.totalPages;
    },
  },
  created() {
    this.page = this.currentPage;
  },
  methods: {
    onHeaderClick(columnName) {
      if (this.sort.sortBy === columnName) {
        this.sort =
          this.sort.sort === "asc"
            ? { sort: "desc", sortBy: columnName }
            : { sortBy: "", sort: "" };
      } else {
        this.sort = { sort: "asc", sortBy: columnName };
      }
      this.$emit("on-column-click", this.sort);
    },
    toPrevPage() {
      this.$emit("to-prev-page");
      this.isErrorPage = false;
    },
    toNextPage() {
      this.$emit("to-next-page");
      this.isErrorPage = false;
    },
    toPage() {
      const page = Number.parseInt(this.page);
      if (page && this.totalPages >= page && page >= 1) {
        this.$emit("to-page", this.page);
        this.isErrorPage = false;
      } else {
        this.isErrorPage = true;
      }
    },
    onSearch() {
      this.$emit("search", this.search);
    },
  },
};
</script>

<style lang="sass" scoped>
.page
  width: 100%

.table-place
  padding: 20px
  border-radius: 15px
  box-shadow: 0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f
  //height: 100%

.search-place
  display: flex
  justify-content: end

.input
  border: none
  height: 35px
  border-bottom: 2px solid #e6e8eb
  &:focus
    outline: none

  &.error
    border-bottom: 2px solid red

.page-input
  width: 40px
  text-align: center

.table-head
  height: 40px

.column-head
  padding: 10px
  cursor: pointer

.table-row
  box-sizing: border-box
  border-top: 1px solid #e6e8eb

td
  padding: 10px
  border-left: 2px solid #e6e8eb

.footer
  display: flex
  justify-content: center
  gap: 20px

.navigation-btn
  color: black
  cursor: pointer
  padding: 6px 12px
  border-radius: 10px
  box-shadow: 0 1px 5px #0003, 0 2px 2px #00000024, 0 3px 1px -2px #0000001f

  &.disabled
    color: gray
    cursor: default
</style>
