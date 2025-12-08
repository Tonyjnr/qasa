import { render, screen } from "@testing-library/react";
import { DataCard } from "./DataCard";
import { Activity } from "lucide-react";

describe("DataCard", () => {
  it("renders title, value, and unit correctly", () => {
    render(<DataCard title="PM2.5" value={12.5} unit="µg/m³" />);

    expect(screen.getByText("PM2.5")).toBeInTheDocument();
    expect(screen.getByText("12.5")).toBeInTheDocument();
    expect(screen.getByText("µg/m³")).toBeInTheDocument();
  });

  it("renders without unit gracefully", () => {
    render(<DataCard title="AQI" value={50} />);

    expect(screen.getByText("AQI")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <DataCard
        title="Health"
        value="Good"
        icon={<Activity data-testid="icon" />}
      />
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <DataCard title="Visualization" value={0}>
        <div data-testid="viz">Custom Viz</div>
      </DataCard>
    );

    expect(screen.getByTestId("viz")).toBeInTheDocument();
  });
});
