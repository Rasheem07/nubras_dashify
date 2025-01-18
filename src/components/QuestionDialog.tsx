"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircleQuestionIcon,
  X,
} from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { IconCancel } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

// Column names based on the schema you provided
const columns = [
  "month___year",
  "sale_order_date",
  "new_invoice_num",
  "nubras_branch",
  "order_taken_status",
  "sales_person",
  "customer_location",
  "order__status",
  "order_payment_status",
  "nubras_gents_item_s_section",
  "hamdania_kid_s",
  "product_quantity",
  "product_price_pc",
  "visa_payment",
  "bank_transfer_payment",
  "cash_payment",
  "advance_amount_payment",
  "total_amount",
  "tax_amount",
  "tax__",
  "amount_excluding_tax",
  "balance_amount",
  "delivery_date",
  "payment_completed_date",
];

interface Summary {
  type: string;
  column?: string;
}

type Summaries = Summary[];

type groupByType = {
  type: string;
  column: string;
  dateGroup?: string;
};

type filterType = {
  column: string;
  type: string;
  value?: string;
  between?: { start: string; end: string };
};

export default function QuestionDialog() {
  const [questionTitle, setQuestionTitle] = useState<string>("");
  const [questionDescription, setQuestionDescription] = useState<string>("");
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [summarize, setSummarize] = useState<Summaries>([]);
  const [groupBy, setGroupby] = useState<groupByType[]>([]);
  const [dateGroup, setDateGroup] = useState<string>("DAY");
  const [filters, setFilters] = useState<filterType[]>([]);
  const [filterState, setFilterState] = useState<{
    selectedColumn: string | null;
    selectedType: string | null;
    startValue: string;
    endValue: string;
  }>({
    selectedColumn: null,
    selectedType: null,
    startValue: "",
    endValue: "",
  });
  // Reusable function to handle dropdown selection
  const handleDropdownSelect = (e: Event, callback: () => void) => {
    e.preventDefault(); // Prevent the dropdown from closing
    callback(); // Execute the provided action
  };

  const handleAddSummarize = (column: string) => {
    if (selectedFunction)
      setSummarize((prev) => [
        ...prev,
        { type: selectedFunction, column: column },
      ]);
    setSelectedFunction(null);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleAddFilter = () => {
    const newFilter: filterType = {
      column: filterState.selectedColumn!,
      type: filterState.selectedType!,
      value:
        filterState.selectedType === "between"
          ? undefined
          : filterState.startValue,
      between:
        filterState.selectedType === "between"
          ? { start: filterState.startValue, end: filterState.endValue }
          : undefined,
    };
    setFilters([...filters, newFilter]);
    setFilterState({
      selectedColumn: null,
      selectedType: null,
      startValue: "",
      endValue: "",
    });
  };

  const handleRemoveSummary = (index: number) => {
    setSummarize((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveGroupBy = (index: number) => {
    setGroupby((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionCreate = async () => {
    const groupByBody = groupBy.length > 0 && groupBy;
    const response = await fetch("/api/questions/create", {
      method: "POST",
      body: JSON.stringify({ questionName: questionTitle, description: questionDescription, summaries: summarize, groupBy: groupByBody, filters }),
    });
    const json = await response.json();
    console.log(json);
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-teal-500 hover:bg-teal-600 shadow-lg py-1.5 px-4 text-white rounded-lg flex items-center gap-x-1">
        Add a new question <MessageCircleQuestionIcon />
      </DialogTrigger>

      <DialogContent className="max-w-[75vw] h-[85vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a new question</DialogTitle>
          <DialogDescription>
            Add a new chart or table to your collections.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col max-w-4xl w-full mx-auto gap-5"
        >
          {/* Title of the question */}
          <div className="flex flex-col gap-2">
            <Label>Title of the question *</Label>
            <Input
              placeholder="Daily Sales from 1-9-2024 to 12-9-2024"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
            />
          </div>

          {/* Description of the question (optional) */}
          <div className="flex flex-col gap-2">
            <Label>
              Description of the question{" "}
              <span className="text-teal-500">(optional)</span>
            </Label>
            <Input
              placeholder="Describe your question in simple words..."
              value={questionDescription}
              onChange={(e) => setQuestionDescription(e.target.value)}
            />
          </div>

          {/* Summarize */}
          <div className="flex flex-col gap-2">
            <Label>Summarize *</Label>
            <div className="flex gap-2 bg-slate-100 border flex-wrap rounded-md py-2 px-4">
              {summarize &&
                summarize.length > 0 &&
                summarize.map((summary, i) => (
                  <Button
                    type="button"
                    key={i}
                    onClick={() => {
                      handleRemoveSummary(i); // Pass the index here
                    }}
                    className="border bg-teal-500 text-white flex items-center gap-x-2"
                  >
                    {summary.type} of{" "}
                    {summary.type === "count" ? "rows" : summary.column}
                    <X />
                  </Button>
                ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="border border-teal-500 text-teal-500"
                  >
                    Pick a function
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[250px] max-h-[300px] overflow-y-auto"
                >
                  {!selectedFunction ? (
                    <>
                      <DropdownMenuLabel>Basic functions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) =>
                          handleDropdownSelect(e, () => {
                            setSummarize((prev) => [
                              ...prev,
                              { type: "count" },
                            ]);
                          })
                        }
                      >
                        Count of rows
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) =>
                          handleDropdownSelect(e, () =>
                            setSelectedFunction("sum")
                          )
                        }
                      >
                        Sum of{" "}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) =>
                          handleDropdownSelect(e, () =>
                            setSelectedFunction("avg")
                          )
                        }
                      >
                        Average of{" "}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) =>
                          handleDropdownSelect(e, () =>
                            setSelectedFunction("max")
                          )
                        }
                      >
                        Max of
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) =>
                          handleDropdownSelect(e, () =>
                            setSelectedFunction("min")
                          )
                        }
                      >
                        Min of
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuLabel
                        className="flex items-center gap-1"
                        onClick={() => setSelectedFunction(null)}
                      >
                        <ChevronLeft className="w-4 h-4" /> {selectedFunction}{" "}
                        of
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {columns.map((column, i) => (
                        <DropdownMenuItem
                          key={i}
                          onClick={() => handleAddSummarize(column)}
                        >
                          {column}
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Group by *</Label>
            <div className="flex gap-2 bg-slate-100 border flex-wrap rounded-md py-2 px-4">
              {groupBy &&
                groupBy.length > 0 &&
                groupBy.map((group, i) => (
                  <Button
                    type="button"
                    key={i}
                    onClick={() => {
                      handleRemoveGroupBy(i); // Pass the index here
                    }}
                    className="border bg-teal-500 text-white flex items-center gap-x-2"
                  >
                    group by {group.column}{" "}
                    {group.type === "date" && `(${group.dateGroup})`}
                    <X />
                  </Button>
                ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="border border-teal-500 text-teal-500"
                  >
                    Pick a column to group
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[300px] max-h-[300px] overflow-y-auto"
                >
                  <DropdownMenuItem
                    className="flex items-center gap-1 max-w-max"
                    onClick={() => setSelectedFunction(null)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {columns.map((column, i) => (
                    <DropdownMenuItem
                      key={i}
                      onClick={() =>
                        setGroupby((prev) => [
                          ...prev,
                          {
                            type:
                              column === "sale_order_date" ? "date" : "column",
                            column: column,
                            dateGroup: dateGroup,
                          },
                        ])
                      }
                    >
                      {column === "sale_order_date" ? (
                        <div className="flex items-center w-full justify-between">
                          {column}
                          <Select
                            onValueChange={(value) => {
                              setDateGroup(value);
                              setGroupby((prev) => [
                                ...prev,
                                {
                                  type: "date",
                                  column: column,
                                  dateGroup: value,
                                },
                              ]);
                            }}
                          >
                            <SelectTrigger className="px-2 text-xs max-w-max">
                              By {dateGroup}
                            </SelectTrigger>
                            <SelectContent align="start">
                              {[
                                "DAY",
                                "week",
                                "month",
                                "quarter",
                                "half",
                                "year",
                              ].map((type, i) => (
                                <SelectItem key={i} value={type}>
                                  By {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <>{column}</>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Filters <span className="text-xs text-teal-500">(optional)</span></Label>
            <div className="flex gap-2 bg-slate-100 border flex-wrap rounded-md py-2 px-4">
              {filters &&
                filters.length > 0 &&
                filters.map((filter, i) => (
                  <Button
                    type="button"
                    key={i}
                    onClick={() => handleRemoveFilter(i)}
                    className="border bg-teal-500 text-white flex items-center gap-x-2"
                  >
                    {filter.type === "between"
                      ? `${filter.column} ${filter.between?.start} ${filter.type} ${filter.between?.end}`
                      : `${filter.column} ${filter.type} ${filter.value}`}
                    <X />
                  </Button>
                ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border border-teal-500 text-teal-500"
                  >
                    {filterState.selectedColumn
                      ? `Filtering by ${filterState.selectedColumn}`
                      : "Pick a column to filter"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-[400px] max-h-[300px] overflow-y-auto"
                >
                  <DropdownMenuItem
                    className="flex items-center gap-1 max-w-max"
                    onClick={() =>
                      setFilterState({
                        ...filterState,
                        selectedColumn: null,
                        selectedType: null,
                      })
                    }
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {filterState.selectedColumn === null ? (
                    columns.map((column, i) => (
                      <DropdownMenuItem
                        key={i}
                        onSelect={(e) =>
                          handleDropdownSelect(e, () =>
                            setFilterState({
                              ...filterState,
                              selectedColumn: column,
                              selectedType: null,
                              startValue: "",
                              endValue: "",
                            })
                          )
                        }
                      >
                        {column}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <>
                      <div className="mt-2 p-2">
                        <Label>
                          Select a filter type for {filterState.selectedColumn}
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "equals to",
                            "greater than",
                            "less than",
                            "between",
                            "not equals to",
                          ].map((type) => (
                            <Button
                              key={type}
                              onClick={() =>
                                setFilterState({
                                  ...filterState,
                                  selectedType: type,
                                })
                              }
                              className="border bg-teal-500 text-white"
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>
                      {filterState.selectedType && (
                        <div className="p-2 space-y-1">
                          {filterState.selectedType === "between" ? (
                            <div>
                              <Label>Start Value</Label>
                              <Input
                                type="text"
                                value={filterState.startValue}
                                onChange={(e) =>
                                  setFilterState({
                                    ...filterState,
                                    startValue: e.target.value,
                                  })
                                }
                                className="border p-1"
                              />
                              <Label>End Value</Label>
                              <Input
                                type="text"
                                value={filterState.endValue}
                                onChange={(e) =>
                                  setFilterState({
                                    ...filterState,
                                    endValue: e.target.value,
                                  })
                                }
                                className="border p-1"
                              />
                            </div>
                          ) : (
                            <div className="py-2">
                              <Label>Value</Label>
                              <Input
                                type="text"
                                value={filterState.startValue}
                                onChange={(e) =>
                                  setFilterState({
                                    ...filterState,
                                    startValue: e.target.value,
                                  })
                                }
                                className="border p-1"
                              />
                            </div>
                          )}
                          <Button
                            onClick={handleAddFilter}
                            className="mt-2 border bg-teal-500 text-white"
                          >
                            Add Filter
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-x-2">
            <Button
              variant={"secondary"}
              className="border flex items-center gap-x-1 w-full"
            >
              Cancel
              <IconCancel />
            </Button>
            <Button
              onClick={handleQuestionCreate}
              className="flex items-center gap-x-1 w-full"
            >
              Save to <ChevronRight />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
