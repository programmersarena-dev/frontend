import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "@/api/axios";
import Loading from "@/components/core/Loading";
import { Textarea } from "@/components/ui";
import { Button, Input, Tabs, Tab } from "@/components/ui";
import AdminPageHeader from "@/components/Admin/PageHeader";
import ReactCountryFlag from "react-world-flags";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    axiosClient
      .get(`/admin/blog/${id}`)
      .then(({ data }) => {
        setBlogData({
          tm: { title: data.title, description: data.description },
          en: { title: data.title_en, description: data.description_en },
          ru: { title: data.title_ru, description: data.description_ru },
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog:", error);
        setLoading(false);
      });
  }, [id]);

  const onSaveClick = () => {
    axiosClient
      .post(`/admin/blog/${id}`, {
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
      .catch((error) => {
        console.error("Error updating blog:", error);
      });
  };

  const onCancelClick = () => {
    navigate("/admin/blogs");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <AdminPageHeader title="Bildirişi üýtget" />
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
          <Button text="Üýtget" onClick={onSaveClick} />
        </div>
      </div>
    </>
  );
}
