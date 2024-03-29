import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import { FaRegEye } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import htmlToText from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import {
  get_all_article,
  delete_article,
} from "../../store/actions/Dashborad/articalAction";

const SubadminProfile = () => {
  const { subAdminEmail } = useParams();
  const [subAdminDetails, setSubAdminDetails] = useState({});
  const dispatch = useDispatch();
  const { allArticle, parPage, articleCount, articleSuccessMessage } =
    useSelector((state) => state.dashboradArtical);
  const { userInfo } = useSelector((state) => state.adminReducer);
  const { currentPage } = useParams();

  useEffect(() => {
    dispatch(get_all_article(currentPage ? currentPage.split("-")[1] : 1, ""));
  }, [currentPage, dispatch]);

  useEffect(() => {
    if (articleSuccessMessage) {
      toast.success(articleSuccessMessage);
      dispatch({ type: "ART_SUCCESS_MESSAGE_CLEAR" });
      dispatch(
        get_all_article(currentPage ? currentPage.split("-")[1] : 1, "")
      );
    }
  }, [dispatch, articleSuccessMessage]);

  useEffect(() => {
    axios
      .get(
        `https://ill-tan-tuna-sock.cyclic.app/rest-api/get-sub-admin-details/${subAdminEmail}`
      )
      .then((response) => {
        setSubAdminDetails(response.data);
      })
      .catch((error) => {
        console.log("Error fetching sub-admin details:", error);
      });
  }, [subAdminEmail]);

  const subAdminArticleCount = allArticle.filter(
    (article) => article.adminName === subAdminDetails.name
  ).length;

  return (
    <div className="sub_admin_profile">
      <Helmet>
        <title>Sub Admin Profile</title>
      </Helmet>
      <div className="profile-contents">
        <div className="numof-search-newAdd">
          <div className="numof">
            <h2>Profile</h2>
          </div>
          <div className="newAdd">
            <Link className="btn" to="/dashborad/all-sub-admin">
              sub admin
            </Link>
          </div>
        </div>
        <div className="profile-image-article">
          <div className="profile-image-details">
            <div className="image">
              <img src={subAdminDetails.image} alt="image" />
            </div>
            <ul className="profile-details">
              <li>
                <span>Name : </span>
                <span>{subAdminDetails.name}</span>
              </li>
              {userInfo === "admin" && (
                <li>
                  <span>Email : </span>
                  <span>{subAdminDetails.email}</span>
                </li>
              )}
              <li>
                <span>Role : </span>
                <span>{subAdminDetails.role}</span>
              </li>
              <li>
                <span>Account create : </span>
                <span>
                  {moment(subAdminDetails.createdAt).format("DD MMM YYYY")}
                </span>
              </li>
              <li>
                <span>Article Write : </span>
                <span>{subAdminArticleCount}</span>
              </li>
            </ul>
          </div>
          <div className="write-articles">
            <h2>Article</h2>
            <div className="articles">
              {allArticle.length > 0
                ? allArticle.map((art, index) => (
                    <div className="article">
                      <img
                        src={`https://ill-tan-tuna-sock.cyclic.app/articalImage/${art.image}`}
                        alt="article-image"
                      />
                      <Link to={`/artical/details/${art.slug}`}>
                        {htmlToText(art.title.slice(0, 30))}
                      </Link>
                      <p>{htmlToText(art.articleText.slice(0, 50))}</p>
                      <div className="action">
                        <span>
                          <Link to={`/dashborad/article/edit/${art.slug}`}>
                            <MdEdit />
                          </Link>
                        </span>
                        <span>
                          <Link>
                            <FaRegEye />
                          </Link>
                        </span>
                        <span onClick={() => dispatch(delete_article(art._id))}>
                          <MdDelete />
                        </span>
                      </div>
                    </div>
                  ))
                : "Article not found..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubadminProfile;
