import { useEffect, useState } from "react";
import axiosClient from "../axios";
import { Outlet, useLocation } from "react-router-dom";
import Loading from "./core/Loading";
import { useStateContext } from "../contexts/ContextProvider";
import Toast from "./core/Toast";

export default function DefaultLayout() {
  const { currentUser, setCurrentUser, setLang } = useStateContext();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [user, lang] = await Promise.all([
          axiosClient.get('/me'),
          axiosClient.get('/lang'),
        ]);
        setCurrentUser(user.data);
        setLang(lang.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    const fetchUserActivity = () => {
      if (currentUser) axiosClient.get("/user-activity");
    };
    fetchUserActivity();
    const intervalId = setInterval(fetchUserActivity, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  if (loading) return <Loading />;

  return (
    <>
      <Outlet />
      <Toast />
    </>
  );
}
