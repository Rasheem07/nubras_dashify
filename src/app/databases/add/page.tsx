/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

const DatabaseForm: React.FC = () => {
  const [useSheet, setUseSheet] = useState(true);
  const [schema, setSchema] = useState<{ name: string; type: string }[]>([]);
  const [dbName, setDbName] = useState("");
  const [dbDescription, setDbDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isHeaderMappingExpanded, setIsHeaderMappingExpanded] = useState(false);
  const [isSchemaMappingExpanded, setIsSchemaMappingExpanded] = useState(false);
  const [headers, setheaders] = useState([]);
  const [mappedHeaders, setMappedHeaders] = useState<string[]>(headers);
  const [types, setTypes] = useState<string[] | []>([]);
  const [isConnecting, setisConnecting] = useState(false);
  const [created, setcreated] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleMappingChange = (index: number, value: string) => {
    const updatedMapping = [...mappedHeaders];
    updatedMapping[index] = value;
    setMappedHeaders(updatedMapping);
  };

  const handleFieldTypeChange = (index: number, value: string) => {
    const updatedSchema = [...schema];
    updatedSchema[index].type = value;
    setSchema(updatedSchema);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const connectToSheet = async (id: string, range: string) => {
    setisConnecting(true);
    const response = await fetch(
      `/api/getsheetdata?spreadsheetId=${id}&range=${range}`,
      { headers: { "Content-Type": "application/json" } }
    );
    const data = await response.json();
    setTypes(data.types);
    setheaders(data.headers);
    setisConnecting(false);
    console.log(data);
  };

  useEffect(() => {
    setMappedHeaders(headers);
  }, [headers]);

  const formValues = watch();

  const CreateDatabase = async () => {
    setcreated(true);
    const response = await fetch(`/api/database/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spreadsheetId: formValues.sheet_id,
        range: formValues.sheet_range,
        headers: mappedHeaders,
        types: types,
        name: dbName,
        description: dbDescription,
      }),
    });

    const json = await response.json();
    console.log(json);
    setcreated(false);
  };

  return (
    <div className="w-full bg-white max-h-[calc(100vh-56px)] overflow-y-scroll">
      <div className="w-full max-w-4xl mx-auto p-8 rounded-xl ">
        <h2 className="text-3xl font-semibold text-teal-600 mb-6 text-center">
          Add Database
        </h2>

        {/* Data Source Selection */}
        <div className="space-y-8">
          <div className="space-y-5">
            <RadioGroup
              className="flex flex-row gap-6"
              value={useSheet ? "google-sheets" : "file-upload"}
              onValueChange={(value) => setUseSheet(value === "google-sheets")}
              defaultValue="option-one"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="google-sheets"
                  id="option-one"
                  className="h-6 w-6"
                />
                <Label htmlFor="option-one" className="text-base">
                  Google sheets
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="file-upload"
                  id="option-one"
                  className="h-6 w-6"
                />
                <Label htmlFor="option-two" className="text-base">
                  File upload (completely static)
                </Label>
              </div>
            </RadioGroup>

            {/* Google Sheets Form */}
            {useSheet ? (
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="w-1/2">
                    <Label
                      htmlFor="sheetId"
                      className="block text-sm text-gray-600"
                    >
                      Google Sheets ID
                    </Label>
                    <Input
                      type="text"
                      id="sheetId"
                      {...register("sheet_id")}
                      placeholder="Enter Google Sheets ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="w-1/2">
                    <Label
                      htmlFor="sheetRange"
                      className="block text-sm text-gray-600"
                    >
                      Range
                    </Label>
                    <Input
                      type="text"
                      id="sheetRange"
                      {...register("sheet_range")}
                      placeholder="Enter Data Range (e.g., Sheet1!A1:C10)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <Button
                    size={"sm"}
                    onClick={() =>
                      connectToSheet(
                        formValues.sheet_id,
                        formValues.sheet_range
                      )
                    }
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Connect to sheet!</>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="fileUpload"
                    className="block text-sm text-gray-600"
                  >
                    Upload File
                  </Label>
                  <Input
                    type="file"
                    id="fileUpload"
                    {...register("sheet_file")}
                    className="w-full py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* Custom Header Mapping */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-lg text-gray-700">
                  Map Your Columns to Database Fields
                </p>
                <Button
                  size={"sm"}
                  onClick={() =>
                    setIsHeaderMappingExpanded(!isHeaderMappingExpanded)
                  }
                  className="bg-teal-600 hover:bg-teal-700  text-base"
                >
                  {isHeaderMappingExpanded ? "Cancel" : "Edit"}
                </Button>
              </div>
              {!isHeaderMappingExpanded ? (
                <p className="text-gray-500">
                  Headers will remain as they are in the sheet.
                </p>
              ) : (
                headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-4 mb-4">
                    <div className="w-1/4">
                      <p className="text-gray-600">{header}</p>
                    </div>
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={mappedHeaders[index]}
                        onChange={(e) =>
                          handleMappingChange(index, e.target.value)
                        }
                        placeholder={`Map ${header} to field`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Custom Schema Mapping */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-lg text-gray-700">
                  Define Schema for Your Data
                </p>
                <Button
                  size={"sm"}
                  onClick={() =>
                    setIsSchemaMappingExpanded(!isSchemaMappingExpanded)
                  }
                  className="bg-teal-600 hover:bg-teal-700  text-base"
                >
                  {isSchemaMappingExpanded ? "Cancel" : "Edit"}
                </Button>
              </div>
              {!isSchemaMappingExpanded ? (
                <p className="text-gray-500">
                  Schema will be auto detected by our system If it is left as it
                  is.
                </p>
              ) : (
                <div className="grid grid-cols-2 grid-flow-row gap-x-12">
                  {mappedHeaders.map((column, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                      <div className="w-full">
                        <p className="text-gray-600">{column}</p>
                      </div>
                      <div className="">
                        <Select
                          onValueChange={(value) =>
                            handleFieldTypeChange(index, value)
                          }
                          defaultValue={types[index]}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Database Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="dbName" className="block text-sm text-gray-600">
                Database Name
              </Label>
              <Input
                type="text"
                id="dbName"
                placeholder="Enter Database Name"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <Label
                htmlFor="dbDescription"
                className="block text-sm text-gray-600"
              >
                Description
              </Label>
              <Textarea
                id="dbDescription"
                placeholder="Enter a brief description"
                rows={4}
                value={dbDescription}
                onChange={(e) => setDbDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pb-6">
            <button
              onClick={CreateDatabase}
              disabled={dbName == "" || dbDescription == ""}
              className="w-full flex justify-center items-center gap-x-1 bg-teal-600 text-white py-3 disabled:opacity-50 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300"
            >
              {" "}
              {created ? (
                <>
                <Loader2 className="h-5 w-5 animate-spin" /> creating a database
                </>
              ) : (
                <>Import database</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseForm;
