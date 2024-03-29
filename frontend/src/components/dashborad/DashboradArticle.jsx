import React, { useEffect } from "react";
import Helmet from "react-helmet";
import { FaRegEye, FaSearch } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import htmlToText from "html-react-parser";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "../home/Pagination";
import toast, { Toaster } from "react-hot-toast";

import {
  get_all_article,
  delete_article,
  update_article_status,
} from "../../store/actions/Dashborad/articalAction";

const DashboradArticle = () => {
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

  const handleStatusClick = (articleId, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "published" : "pending";
    dispatch(update_article_status(articleId, newStatus));
  };
  console.log(userInfo.role);

  return (
    <div className="dashborad-article">
      <Helmet>
        <title>BlogifyBlog - All Article</title>
      </Helmet>
      <Toaster
        position={"bottom-center"}
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "15px",
          },
        }}
      />
      <div className="article-action-pagination">
        <div className="numof-search-newAdd">
          <div className="numof">
            <h2>Articles ({allArticle.length})</h2>
          </div>
          <div className="searchOf">
            <div className="search">
              <input
                onChange={(e) =>
                  dispatch(
                    get_all_article(
                      currentPage ? currentPage.split("-")[1] : 1,
                      e.target.value
                    )
                  )
                }
                type="text"
                placeholder="search article"
                className="form-control"
              />
            </div>
            <span>
              <FaSearch />
            </span>
          </div>
          <div className="newAdd">
            <Link className="btn" to="/dashborad/article-add">
              Add New
            </Link>
          </div>
        </div>
        <div className="height-70vh">
          <div className="articles">
            {allArticle.length > 0
              ? allArticle.map((art, index) => (
                  <div className="article" key={index}>
                    <img
                      src={`https://ill-tan-tuna-sock.cyclic.app/articalImage/${art.image}`}
                      alt="article-image"
                    />
                    <Link to={`/artical/details/${art.slug}`}>
                      {htmlToText(art.title.slice(0, 40))}
                    </Link>
                    {userInfo.role === "admin" ? (
                      <button
                        onClick={() => handleStatusClick(art._id, art.status)}
                        style={{
                          backgroundColor:
                            art.status === "pending" ? "red" : "green",
                          borderColor:
                            art.status === "pending" ? "red" : "green",
                          color: "white",
                          borderRadius: "5px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        {art.status.toUpperCase()}
                      </button>
                    ) : (
                      <p>{art.status}</p>
                    )}
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
        {articleCount === 0 || articleCount < parPage ? (
          ""
        ) : (
          <Pagination
            pageNumber={currentPage ? currentPage.split("-")[1] : 1}
            parPage={parPage}
            itemCount={articleCount}
            path="/dashborad/all-article"
          />
        )}
      </div>
    </div>
  );
};

export default DashboradArticle;
