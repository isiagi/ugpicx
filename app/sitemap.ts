import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    {
      url: "https://www.ugpicx.com/",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.1,
    },
    {
      url: "https://www.ugpicx.com/category/all",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.1,
    },
    {
      url: "https://www.ugpicx.com/category/nature",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/wildlife",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/architecture",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/people",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/culture",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/cities",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/technology",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/food",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/art",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/sports",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/travel",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/category/fashion",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.ugpicx.com/about",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.1,
    },
    {
      url: "https://www.ugpicx.com/privacy",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.1,
    },
    {
      url: "https://www.ugpicx.com/user-profile",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.1,
    },
    {
      url: "https://www.ugpicx.com/sign-in",
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
