"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

type StatusCode = {
  code: number;
  title: string;
  description: string;
  category: string;
};

const statusCodes: StatusCode[] = [
  { code: 100, title: "Continue", description: "The server has received the request headers and the client should proceed to send the request body.", category: "1xx" },
  { code: 101, title: "Switching Protocols", description: "The requester has asked the server to switch protocols and the server has agreed to do so.", category: "1xx" },
  { code: 102, title: "Processing", description: "The server has received and is processing the request, but no response is available yet.", category: "1xx" },
  { code: 103, title: "Early Hints", description: "Used to return some response headers before final HTTP message.", category: "1xx" },
  { code: 200, title: "OK", description: "The request has succeeded. The meaning of the success depends on the HTTP method.", category: "2xx" },
  { code: 201, title: "Created", description: "The request has been fulfilled and has resulted in one or more new resources being created.", category: "2xx" },
  { code: 202, title: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed.", category: "2xx" },
  { code: 203, title: "Non-Authoritative Information", description: "The request succeeded but the enclosed payload has been modified by a proxy.", category: "2xx" },
  { code: 204, title: "No Content", description: "The server successfully processed the request and is not returning any content.", category: "2xx" },
  { code: 205, title: "Reset Content", description: "The server successfully processed the request, but is not returning any content and requires the requester to reset the document view.", category: "2xx" },
  { code: 206, title: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client.", category: "2xx" },
  { code: 300, title: "Multiple Choices", description: "The request has more than one possible response. The user agent should choose one.", category: "3xx" },
  { code: 301, title: "Moved Permanently", description: "The URL of the requested resource has been changed permanently. The new URL is given in the response.", category: "3xx" },
  { code: 302, title: "Found", description: "The URI of requested resource has been changed temporarily. Further changes may occur in the future.", category: "3xx" },
  { code: 303, title: "See Other", description: "The response to the request can be found under another URI using a GET method.", category: "3xx" },
  { code: 304, title: "Not Modified", description: "The resource has not been modified since the version specified by the request headers.", category: "3xx" },
  { code: 307, title: "Temporary Redirect", description: "The requested resource resides temporarily under a different URI.", category: "3xx" },
  { code: 308, title: "Permanent Redirect", description: "The requested resource has been assigned a new permanent URI.", category: "3xx" },
  { code: 400, title: "Bad Request", description: "The server could not understand the request due to invalid syntax.", category: "4xx" },
  { code: 401, title: "Unauthorized", description: "The client must authenticate itself to get the requested response.", category: "4xx" },
  { code: 402, title: "Payment Required", description: "This response code is reserved for future use.", category: "4xx" },
  { code: 403, title: "Forbidden", description: "The client does not have access rights to the content.", category: "4xx" },
  { code: 404, title: "Not Found", description: "The server can not find the requested resource.", category: "4xx" },
  { code: 405, title: "Method Not Allowed", description: "The request method is known by the server but is not supported by the target resource.", category: "4xx" },
  { code: 406, title: "Not Acceptable", description: "The server cannot produce a response matching the list of acceptable values.", category: "4xx" },
  { code: 407, title: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy.", category: "4xx" },
  { code: 408, title: "Request Timeout", description: "The server would like to shut down this unused connection.", category: "4xx" },
  { code: 409, title: "Conflict", description: "The request conflicts with the current state of the server.", category: "4xx" },
  { code: 410, title: "Gone", description: "The requested content has been permanently deleted from the server.", category: "4xx" },
  { code: 411, title: "Length Required", description: "The server refuses to accept the request without a defined Content-Length.", category: "4xx" },
  { code: 412, title: "Precondition Failed", description: "The client has indicated preconditions in its headers which the server does not meet.", category: "4xx" },
  { code: 413, title: "Payload Too Large", description: "The request entity is larger than limits defined by server.", category: "4xx" },
  { code: 414, title: "URI Too Long", description: "The URI requested by the client is longer than the server is willing to interpret.", category: "4xx" },
  { code: 415, title: "Unsupported Media Type", description: "The media format of the requested data is not supported by the server.", category: "4xx" },
  { code: 416, title: "Range Not Satisfiable", description: "The range specified by the Range header cannot be fulfilled.", category: "4xx" },
  { code: 417, title: "Expectation Failed", description: "The expectation indicated by the Expect header cannot be met.", category: "4xx" },
  { code: 418, title: "I'm a Teapot", description: "The server refuses the attempt to brew coffee with a teapot.", category: "4xx" },
  { code: 422, title: "Unprocessable Entity", description: "The request was well-formed but was unable to be followed due to semantic errors.", category: "4xx" },
  { code: 423, title: "Locked", description: "The resource that is being accessed is locked.", category: "4xx" },
  { code: 424, title: "Failed Dependency", description: "The request failed due to failure of a previous request.", category: "4xx" },
  { code: 425, title: "Too Early", description: "The server is unwilling to risk processing a request that might be replayed.", category: "4xx" },
  { code: 426, title: "Upgrade Required", description: "The client should switch to a different protocol.", category: "4xx" },
  { code: 428, title: "Precondition Required", description: "The origin server requires the request to be conditional.", category: "4xx" },
  { code: 429, title: "Too Many Requests", description: "The user has sent too many requests in a given amount of time.", category: "4xx" },
  { code: 431, title: "Request Header Fields Too Large", description: "The server is unwilling to process the request because header fields are too large.", category: "4xx" },
  { code: 451, title: "Unavailable For Legal Reasons", description: "The requested resource is unavailable due to a legal demand.", category: "4xx" },
  { code: 500, title: "Internal Server Error", description: "The server has encountered a situation it does not know how to handle.", category: "5xx" },
  { code: 501, title: "Not Implemented", description: "The request method is not supported by the server and cannot be handled.", category: "5xx" },
  { code: 502, title: "Bad Gateway", description: "The server received an invalid response from the upstream server.", category: "5xx" },
  { code: 503, title: "Service Unavailable", description: "The server is not ready to handle the request.", category: "5xx" },
  { code: 504, title: "Gateway Timeout", description: "The server is acting as a gateway and cannot get a response in time.", category: "5xx" },
  { code: 505, title: "HTTP Version Not Supported", description: "The HTTP version used in the request is not supported by the server.", category: "5xx" },
  { code: 506, title: "Variant Also Negotiates", description: "The server has an internal configuration error.", category: "5xx" },
  { code: 507, title: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request.", category: "5xx" },
  { code: 508, title: "Loop Detected", description: "The server detected an infinite loop while processing the request.", category: "5xx" },
  { code: 510, title: "Not Extended", description: "Further extensions to the request are required for the server to fulfill it.", category: "5xx" },
  { code: 511, title: "Network Authentication Required", description: "The client needs to authenticate to gain network access.", category: "5xx" },
];

const categories = ["All", "1xx", "2xx", "3xx", "4xx", "5xx"];

const categoryColors: Record<string, string> = {
  "1xx": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "2xx": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "3xx": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "4xx": "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  "5xx": "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function HttpStatusCodes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return statusCodes.filter((s) => {
      const matchesSearch =
        !search ||
        String(s.code).includes(search) ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || s.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by code, title, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setCategory(cat)}
            variant={category === cat ? "default" : "outline"}
            size="sm"
          >
            {cat === "All" ? "All" : cat}
          </Button>
        ))}
        <div className="text-muted-foreground ml-auto self-center text-sm">
          {filtered.length} of {statusCodes.length}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No status codes found.</p>
        ) : (
          filtered.map((s) => (
            <Card key={s.code} className="hover:bg-accent/50 transition-colors">
              <CardContent className="flex items-start gap-4 p-4">
                <span
                  className={`inline-flex shrink-0 items-center rounded-md px-2.5 py-0.5 text-sm font-semibold ${categoryColors[s.category]}`}
                >
                  {s.code}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-muted-foreground text-sm">{s.description}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
