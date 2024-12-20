import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import axios from "axios";
import { Button, Input, message, notification } from "antd";
import SecondComponent from "./SecondComponent";
function App() {
  const Addref = useRef();
  const queryClient = useQueryClient();
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [search , setSearch] = useState(null)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["TODO"],
    queryFn: () =>
      axios
        .get("https://6750968269dc1669ec1bb204.mockapi.io/comments")
        .then((data) => data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      axios({
        url: `https://6750968269dc1669ec1bb204.mockapi.io/comments/${id}`,
        method: "DELETE",
      }).then((data) => data.data),

    onSuccess: () => queryClient.invalidateQueries(["TODO"]),
  });

  const UpdateMutation = useMutation({
    mutationFn: (upDatedata) =>
      axios({
        url: `https://6750968269dc1669ec1bb204.mockapi.io/comments/${upDatedata.id}`,
        method: "PUT",
        data: upDatedata,
      }).then((data) => data.data),
    onSuccess: () => queryClient.invalidateQueries(["TODO"]),
  });

  const AddMutation = useMutation({
    mutationFn: (newData) =>
      axios({
        url: "https://6750968269dc1669ec1bb204.mockapi.io/comments/",
        method: "POST",
        data: newData,
      }).then((data) => data.data),
    onSuccess: () => queryClient.invalidateQueries(["TODO"]),
  });

  const submit = (e) => {
    e.preventDefault();
    const newData = { name: Addref.current.input.value };
    AddMutation.mutate(newData);
  };
  const submitEdit = (e) => {
    e.preventDefault();
    const upDatedata = { id: editId, name: editName };
    UpdateMutation.mutate(upDatedata);
    setEditId(null);
  };

  return (
    <div className="w-full ">
      <form className="m-auto flex items-end gap-3  w-[30%]" onSubmit={submit}>
        <Input ref={Addref} className="mt-[30px]  " />
        <Button htmlType="submit" >Add</Button>
      </form>
      <br />
      {editId && (
        <form className="w-[30%] flex items-end gap-3 m-auto" onSubmit={submitEdit}>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <Button htmlType="submit" onClick={()=>notification.success({message:'Malumot saqlandi'})}>Save</Button>
        </form>
      )}
      {isLoading ? (
        <p className="text-red-800 text-[43px]">Loading....</p>
      ) : (
        data?.map((value) => (
          <div
            className="w-[30%] mt-3 flex justify-center items-center  gap-[30px] m-auto bg-orange-400 p-4"
            key={value.id}
          >
            <div className="mt-5 flex gap-4 items-center">
              <p>{value.name}</p>
              <Button
                onClick={() => {
                  deleteMutation.mutate(value.id);
                  !deleteMutation.isError &&
                    notification.info({ message: "Malumot ochirildi" });
                }}
              >
                Delete
              </Button>
              <Button
                onClick={() => {
                  setEditId(value.id);
                  setEditName(value.name);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        ))
      )}

      {/* <SecondComponent /> */}
    </div>
  );
}

export default App;
