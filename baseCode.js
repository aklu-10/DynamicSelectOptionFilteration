import React, { useState } from "react";
import ReactDOM from "react-dom";

const ParticularTechnology = ({
  fieldOptions,
  addNewTech,
  techName,
  setAllTech,
  allTech,
  initial,
  loader,
  setLoader
}) => {
  function handleChange(event) {
    event.persist();

    let resultObj = {};

    let techKeyArr = Object.keys(allTech);
    let startIndex = techKeyArr.indexOf(techName);
    let nonOperationalKeys = techKeyArr.slice(0, startIndex);
    let operationalKeys = techKeyArr.slice(startIndex);

    nonOperationalKeys.map((key) => {
      resultObj = { ...resultObj, [key]: allTech[key] };
    });

    let nextBaseFilterArr, nextSelectedValue;

    if (nonOperationalKeys.length === 0) {
      nextBaseFilterArr = initial;
      nextSelectedValue = "";
    } else {
      nextBaseFilterArr = allTech[nonOperationalKeys.slice(-1)[0]].technologies;
      nextSelectedValue = allTech[nonOperationalKeys.slice(-1)[0]].selected;
    }

    operationalKeys.map((key) => {
      let currentBaseFilterArr = nextBaseFilterArr.filter(
        (data) => data.value !== nextSelectedValue.value
      );
      let currentSelected;
      if (techName === key) {
        currentSelected = {
          label: event.target.value,
          value: event.target.value
        };
      } else {
        currentSelected = currentBaseFilterArr[0];
      }
      resultObj = {
        ...resultObj,
        [key]: { technologies: currentBaseFilterArr, selected: currentSelected }
      };

      nextBaseFilterArr = currentBaseFilterArr;
      nextSelectedValue = currentSelected;
    });

    setAllTech({ ...resultObj });

    setLoader(true);

    setTimeout(() => setLoader(false), 10);
  }

  return (
    <>
      {loader ? (
        <p>Loading...</p>
      ) : (
        <select
          onChange={handleChange}
          value={allTech[techName].selected.value}
          key={techName}
        >
          {loader ? (
            <span>loading...</span>
          ) : (
            fieldOptions.map((technology, index) =>
              loader ? (
                <></>
              ) : (
                <option key={technology.value} value={technology.value}>
                  {technology.label}
                </option>
              )
            )
          )}
        </select>
      )}
      <button onClick={addNewTech}>Add</button>
    </>
  );
};

function App() {
  let technologies = [
    { label: "Python", value: "Python" },
    { label: "Java", value: "Java" },
    { label: "React", value: "React" },
    { label: "JavaScript", value: "JavaScript" }
  ];
  const [loader, setLoader] = useState(false);

  const [allTech, setAllTech] = useState({
    technology1: { technologies: [...technologies], selected: technologies[2] }
  });

  const addNewTech = () => {
    if (Object.keys(allTech).length >= technologies.length) return;

    let base = {
      technologies: [],
      selected: {}
    };

    let prevTechnologies =
      allTech[Object.keys(allTech).slice(-1)[0]].technologies;

    let prevSelected = allTech[Object.keys(allTech).slice(-1)[0]].selected;

    base.technologies = prevTechnologies.filter(
      (technology) => technology.value != prevSelected.value
    );

    base.selected = base.technologies[0];

    let nextTechKeyName =
      "technology" + (Number(Object.keys(allTech).slice(-1)[0].slice(-1)) + 1);
    setAllTech((prev) => ({ ...prev, [nextTechKeyName]: { ...base } }));
  };

  return (
    <div className="App">
      {Object.keys(allTech).map((tech) => (
        <ParticularTechnology
          key={tech}
          fieldOptions={allTech[tech].technologies}
          addNewTech={addNewTech}
          setAllTech={setAllTech}
          allTech={allTech}
          techName={tech}
          initial={technologies}
          loader={loader}
          setLoader={setLoader}
        />
      ))}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
