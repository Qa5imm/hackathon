import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      // get presigned url
      const {
        data: { url, key },
      } = await axios.post("/storage/upload", {
        fileName: file.name,
      });

      // upload to r2
      await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      return key;
    },
  });
};
