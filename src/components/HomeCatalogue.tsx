"use client";

import { useState } from "react";
import type { HomepageData } from "@/lib/types";

interface HomeCatalogueProps {
  data: HomepageData["products_by_service"];
}

export default function HomeCatalogue({ data }: HomeCatalogueProps) {
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [activeProductIdxs, setActiveProductIdxs] = useState<Record<number, number>>({});

  if (data.length === 0) return null;

  const currentService = data[activeServiceIdx];
  const products = currentService?.products || [];
  const currentProductIdx = activeProductIdxs[activeServiceIdx] || 0;
  const activeProduct = products[currentProductIdx];

  return (
    <section className="service-achievement pt-110 pb-90">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-10">
            <div className="section_title_wrapper text-center mb-50 wow fadeInUp" data-wow-delay="0.3s">
              <span className="subtitle price-sb-title">
                Our Service Catalogue
              </span>
              <h2 className="section-title section-title-black">
                Explore what we offer
              </h2>
            </div>
          </div>
        </div>
        <div className="container-fluid product-nav">
          {/* Service Tabs */}
          <ul
            className="nav nav-tabs scroll-emm-container"
            style={{ overflowX: "auto", overflowY: "hidden", flexWrap: "nowrap" }}
          >
            {data.map((item, idx) => (
              <li className="nav-item" key={item.service.id}>
                <a
                  className={`nav-link${idx === activeServiceIdx ? " active" : ""}`}
                  style={{ whiteSpace: "nowrap", cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveServiceIdx(idx);
                  }}
                  href={`#menu${item.service.id}`}
                >
                  {item.service.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {currentService && (
              <div className="tab-pane fade show active">
                <div className="mt-3">
                  <div className="row">
                    {/* Product Sub-Tabs (left column) */}
                    <div className="col-md-3 mb-4">
                      <ul className="nav nav-pills flex-column" role="tablist">
                        {products.map((product, pIdx) => (
                          <li className="nav-item" key={product.id}>
                            <a
                              className={`nav-link${pIdx === currentProductIdx ? " active" : ""}`}
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveProductIdxs({
                                  ...activeProductIdxs,
                                  [activeServiceIdx]: pIdx,
                                });
                              }}
                              role="tab"
                              href={`#menu${currentService.service.id}-tab${product.id}`}
                            >
                              {product.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Product Content (right column) */}
                    <div className="col-md-9">
                      {activeProduct ? (
                        <div className="tab-pane fade show active" role="tabpanel">
                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <iframe
                                width="100%"
                                height="100%"
                                src={activeProduct.video_url}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{ minHeight: "250px" }}
                              ></iframe>
                            </div>
                            <div className="col-md-6 mb-4">
                              <div className="swiper">
                                <div className="swiper-wrapper">
                                  <div className="swiper-slide swiper-slide-product-emma">
                                    <img
                                      src={activeProduct.image_url}
                                      alt={activeProduct.name}
                                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div>Product id: {activeProduct.id}</div>
                            <div
                              className="mt-3"
                              dangerouslySetInnerHTML={{ __html: activeProduct.content }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-5">
                          <p>Select a product to view details</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
