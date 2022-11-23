import axios from "axios";

export const getTableData = async () => {
  const { data } = await axios.get("http://localhost:5173/api.json");
  return data;
};
