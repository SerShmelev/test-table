<template>
  <div class="page">
    <MyTable
      :columns="columns"
      :data="getCurrentTablePage"
      :current-page="pagination.currentPage"
      :totalPages="pagination.totalPages"
      @on-column-click="setSort"
      @to-prev-page="prevPage"
      @to-next-page="nextPage"
      @to-page="toPage"
      @search="setSearch"
    />
  </div>
</template>

<script>
import MyTable from "./../components/MyTable.vue";
import { getTableData } from "../services/myService";
import moment from "moment";

export default {
  name: "MainPage",
  components: {
    MyTable,
  },
  data() {
    return {
      columns: [
        {
          name: "Аватар",
          value: "avatar",
        },
        {
          name: "ФИО",
          value: "fullName",
        },
        {
          name: "Пол",
          value: "gender",
        },
        {
          name: "Страна",
          value: "country",
        },
        {
          name: "День рождения",
          value: "birthday",
        },
        {
          name: "Почта",
          value: "email",
        },
        {
          name: "Телефон",
          value: "phone",
        },
      ],
      tableData: [],
      pagination: {
        totalResults: 0,
        currentPage: 1,
        pageSize: 20,
        totalPages: 0,
      },
      search: "",
      sort: { sortBy: "", sort: "" },
    };
  },

  async created() {
    const data = await getTableData();
    this.setPagination(data.info.results);
    this.parseUrl();
    this.tableData = this.parseTableData(data.results);
  },
  computed: {
    getFilteredTableData() {
      const data = [];
      this.tableData.forEach((item) => {
        const fields = Object.keys(item);
        for (let i = 0; i < fields.length; i += 1) {
          if (item[fields[i]].toString().includes(this.search)) {
            data.push(item);
            break;
          }
        }
      });
      return data;
    },
    getCurrentTablePage() {
      let filteredTableData = this.search.length
        ? [...this.getFilteredTableData]
        : [...this.tableData];
      this.setPagination(filteredTableData.length);
      const firstEl =
        (this.pagination.currentPage - 1) * this.pagination.pageSize;
      if (this.sort.sort) {
        filteredTableData = filteredTableData.sort((a, b) =>
          this.sort.sort === "asc"
            ? a[this.sort.sortBy] > b[this.sort.sortBy]
              ? 1
              : b[this.sort.sortBy] > a[this.sort.sortBy]
              ? -1
              : 0
            : b[this.sort.sortBy] > a[this.sort.sortBy]
            ? 1
            : a[this.sort.sortBy] > b[this.sort.sortBy]
            ? -1
            : 0
        );
      }
      return filteredTableData.slice(
        firstEl,
        firstEl + this.pagination.pageSize
      );
    },
  },
  methods: {
    setPagination(elementsCount) {
      this.pagination.totalResults = elementsCount;
      this.pagination.totalPages = Math.ceil(
        elementsCount / this.pagination.pageSize
      );
    },
    nextPage() {
      this.pagination.currentPage += 1;
      this.setUrl();
    },
    prevPage() {
      this.pagination.currentPage -= 1;
      this.setUrl();
    },
    toPage(page) {
      this.pagination.currentPage = Number.parseInt(page);
      this.setUrl();
    },
    setSort(sorting) {
      this.sort = sorting;
      this.setUrl();
    },
    setSearch(search) {
      this.search = search;
      this.pagination.currentPage = 1;
      this.setUrl();
    },
    parseTableData(data) {
      return data.map((item) => {
        return {
          avatar: item.picture.medium,
          fullName: `${item.name.title} ${item.name.first} ${item.name.last}`,
          gender: item.gender,
          country: item.location.city,
          birthday: moment(item.dob.date).utc().format("DD.MM.YYYY"),
          email: item.email,
          phone: item.phone,
        };
      });
    },
    parseUrl() {
      const queries = this.$route.query;
      if (queries.sort && queries.sortBy) {
        this.sort = {
          sort: queries.sort,
          sortBy: queries.sortBy,
        };
      }
      if (
        queries.page &&
        queries.page < this.pagination.totalPages &&
        queries.page > 0
      ) {
        this.pagination.currentPage = Number.parseInt(queries.page);
      }
      if (queries.search) {
        this.search = queries.search;
      }
    },
    setUrl() {
      const query = { page: this.pagination.currentPage };
      if (this.sort.sortBy && this.sort.sort) {
        query.sort = this.sort.sort;
        query.sortBy = this.sort.sortBy;
      }
      if (this.search !== "") {
        query.search = this.search;
      }
      this.$router.push({ query });
    },
  },
};
</script>

<style lang="sass" scoped>
.page
  width: 100%
  height: 100%
</style>
