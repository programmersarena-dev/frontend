import React, { useState } from "react";
import axiosClient from "../../../axios";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui";
import { Button, Input, Tabs, Tab } from "@/components/ui";
import { useStateContext } from "../../../contexts/ContextProvider";
import AdminPageHeader from "@/components/Admin/PageHeader";
import AdminComponent from "@/components/Admin/AdminComponent";
import ReactCountryFlag from "react-world-flags";

export default function AddBlog() {
  const { showToast } = useStateContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tm");

  const [blogData, setBlogData] = useState({
    tm: { title: "", description: "" },
    en: { title: "", description: "" },
    ru: { title: "", description: "" },
  });

  const handleChange = (lang, field, value) => {
    setBlogData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  const onSaveClick = () => {
    axiosClient
      .post("/admin/blog/add", {
        title: blogData.tm.title,
        description: blogData.tm.description,
        title_en: blogData.en.title,
        description_en: blogData.en.description,
        title_ru: blogData.ru.title,
        description_ru: blogData.ru.description,
      })
      .then(() => {
        navigate("/admin/blogs");
      })
      .catch((err) => {
        showToast("Error creating blog", "error");
        console.error("Error creating blog:", err);
      });
  };

  const onCancelClick = () => {
    navigate("/admin/blogs");
  };

  return (
    <AdminComponent>
      <AdminPageHeader title="Täze bildiriş goş" />
      <div className="bg-white p-6 rounded-lg shadow-md">

        <div className="mb-4">
          <Tabs>
            <Tab active={activeTab === "tm"} onClick={() => setActiveTab("tm")}>
              <ReactCountryFlag code="TM" svg style={{ width: '24px', height: '24px' }} />
            </Tab>
            <Tab active={activeTab === "en"} onClick={() => setActiveTab("en")}>
              <ReactCountryFlag code="US" svg style={{ width: '24px', height: '24px' }} />
            </Tab>
            <Tab active={activeTab === "ru"} onClick={() => setActiveTab("ru")}>
              <ReactCountryFlag code="RU" svg style={{ width: '24px', height: '24px' }} />
            </Tab>
          </Tabs>
        </div>

        <Input
          text="Tema"
          title={blogData[activeTab].title}
          setTitle={(value) => handleChange(activeTab, "title", value)}
        />
        <Textarea
          text="Mazmun"
          description={blogData[activeTab].description}
          setDescription={(value) => handleChange(activeTab, "description", value)}
          activeTab={activeTab}
        />

        <div className="flex justify-end space-x-4">
          <Button text="Yza" onClick={onCancelClick} />
          <Button text="Goş" onClick={onSaveClick} />
        </div>
      </div>
    </AdminComponent>
  );
}
