// Init dimensions
const FRAME_HEIGHT = 700;
const FRAME_WIDTH = 750;
const PADDING = 10;
const MARGINS = {left: 75,
                right: 75,
                top:75,
                bottom:75};

// Assign html div to frame
const FRAME1 = d3.select('#vis1')
                .append('svg')
                    .attr('height', FRAME_HEIGHT)
                    .attr('width', FRAME_WIDTH)
                    .attr('class', 'frame');

// Assign html div to frame
const FRAME2 = d3.select('#vis2')
                .append('svg')
                    .attr('height', FRAME_HEIGHT)
                    .attr('width', FRAME_WIDTH)
                    .attr('class', 'frame');

// Dimensions for ease of use
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right

d3.csv('data/revdata.csv').then((data) => {

    // Function to parse date column
    const parseDate = d3.timeParse("%Y-%m-%d")
    const formatYear = d3.timeFormat("%Y");
    // Frame 1: Stacked Bar

    // will be used for mapping
    const DEFINITIONS = {
        act: 'Total Current Assets',
        ppent: 'Total Property, Plant, and Equipment',
        intan: 'Total Intangible Assets',
        ivaeq: 'Investments and Advances - Equity Method',
        ivao: 'Investments and Advances - Other',
        ao: 'Total Other Assets',
        lct: 'Total Current Liabilities',
        txditc: 'Deferred Taxes and Investment Tax Credit',
        lo: 'Other Liabilities',
        dltt: 'Total Long-Term Debt',
        ceq: 'Total Common/Ordinary Equity',
        pstk: 'Total Preferred/Preference Stock (Capital)',
        mibn: 'Nonredeemable Noncontrolling Interest',
        at: 'Total Assets',
        lt: 'Total Liabilities',
        teq: "Total Stockholders' Equity"
    };

    // will be used for legends
    const vis1_keys = ['Assets', 'Liabilities', "Equity"];
    const key_colors = ['blue', 'red', 'green'];

    // Populate dropdown with year choices
    let choose_years = new Set(data.map(d => d.fyear));
    d3.select("#selectYear")
      .selectAll("option")
      .data([...choose_years])
      .enter()
      .append("option")
      .text(d => d);

    // Get all tickers and populate checkbox options
    let all_tickers = Array.from(new Set(data.map(d => d.tic))).sort();
    let INIT_CHECKED = ['AAPL', 'VZ', 'TGT', 'IBM', 'PFE', 'MSFT', 'NFLX']
    d3.select('#selectCompanies')
        .selectAll('label')
        .data([...all_tickers])
        .enter()
        .append('label')
        .each(function(){
                d3.select(this)
                    .append('input')
                    .attr('type', 'checkbox')
                    .attr('class', 'company_cb')
                    .attr('value', d => d)
                    .attr('checked', (d) => {
                        if (INIT_CHECKED.includes(d)){
                            return 'checked';
                        } else{
                            return null;
                        }
                    });

                d3.select(this)
                    .append('span')
                    .html(d => d)
                    .append("br");
            });


    // Initialize first year to render site with
    let cur_year = d3.select("#selectYear").node().value;

    // Track currently selected companies from checkboxes
    let cur_companies = d3.selectAll('.company_cb:checked')
                            .nodes()
                            .map(node => node.value);

    // Add event listener to plot, changes with dropdown changes
    d3.select('#selectYear').on('change', updatePlot);
    

    // Event listener to update plot with checkbox filtering
    d3.select('#selectCompanies').on('change', updatePlot);
    

    // Callback function to update viz1 when filtering and year selection are done
    function updatePlot() {

        // Find currently selected years and companies to filter with
        cur_year = d3.select("#selectYear").node().value;
        document.getElementById('year-title').innerHTML = cur_year +' Balance Sheet Breakdown';

        cur_companies = d3.selectAll('.company_cb:checked')
                            .nodes()
                            .map(node => node.value);

        // Clear the frame of all bars
        FRAME1.selectAll("rect").remove();
        FRAME1.selectAll(".axis").remove();

        // Plots the new bars
        plot_bars();
        tooltips();

        // This may seem repetitive but ensures that selected bars stay selected
        // after any kinda of filtering or re-selection

        // Increase opacity of bars that are clicked on
        FRAME1.selectAll("rect")
            .filter(d => d.data.tic === selectedBars.tic)
            .style("opacity", 1);

        // Decrease opacity of bars not clicked on
        FRAME1.selectAll("rect")
            .filter(d => d.data.tic !== selectedBars.tic)
            .style("opacity", 0.4);
    }

    const PADDING = 0.4;

    // groups based off tic
    const groups = data.map(d => d.tic);

    // to assist with formating large numbers
    function formatNumber(num) {
        return num.toLocaleString();
      }

    // initial tic value to display
    selectedBars = { tic: 'AAPL' };

    // creating scales
    const X_SCALE = d3.scaleBand()
        .domain(groups)
        .range([0, VIS_WIDTH])
        .padding(PADDING);

    // max y value
    const Y_MAX = d3.max(data, (d) => {
        return Math.max(d.at/d.at, d.lt/d.at, d.teq/d.at)
    });

    // y scale needed
    const Y_SCALE = d3.scaleLinear()
        .domain([0, Y_MAX])
        .range([VIS_HEIGHT, 0])

    // add y axis
    FRAME1.append('g')
        .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
        .attr('class', 'axis')
        .call(d3.axisLeft(Y_SCALE).ticks(10))
        .attr('font-size', '10px');

    // y axis label
    FRAME1.append('text')
        .attr('y', 35)
        .attr('x', 0 - VIS_HEIGHT/2 - MARGINS.top)
        .style('text-anchor', 'middle')
        .text('Proportion of Total Assets')
        .attr('font-size', '12px')
        .attr('transform', 'rotate(-90)')

    // add x axis
    FRAME1.append('g')
        .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
        .attr('class', 'axis')
        .call(d3.axisBottom(X_SCALE).ticks(3))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('font-size', '10px')
        .attr('transform', 'rotate(-45)');

    // x axis label
    FRAME1.append('text')
        .attr('x', VIS_WIDTH/2 + MARGINS.left)
        .attr('y', FRAME_HEIGHT - 20)
        .style('text-anchor', 'middle')
        .text('Ticker')
        .attr('font-size', '12px');

    // Create svg container for each type of bar: asset, liab, eq
    g_assets = FRAME1.append('g').classed('asset-bars', true);
    g_liab = FRAME1.append('g').classed('liability-bars', true);
    g_eq = FRAME1.append('g').classed('equity-bars', true);

    // Specify desired columns
    const all_subgroups = ['plot_at', 'plot_lt', 'plot_teq']
    const asset_subgroups = ['plot_act', 'plot_ppent', 'plot_ivaeq', 'plot_ivao', 'plot_intan', 'plot_ao'];
    const liab_subgroups = ['plot_lct', 'plot_txditc', 'plot_lo', 'plot_dltt']
    const eq_subgroups = ['plot_ceq', 'plot_pstk', 'plot_mibn']


    // creating color scales for each set of groups
    const all_color = d3.scaleOrdinal()
            .domain(all_subgroups)
            .range(['blue', 'red', 'green']);
    const asset_color = d3.scaleOrdinal()
            .domain(asset_subgroups)
            .range(['#00a9ff', '#51b5ff', '#84c8ff', '#b4e0ff', '#ceefff', '#ddf9ff']);
    const liab_color = d3.scaleOrdinal()
            .domain(liab_subgroups)
            .range(['#ff0000', '#ff3921', '#ff6044', '#ff8870']);
    const eq_color = d3.scaleOrdinal()
            .domain(eq_subgroups)
            .range(['#54ff00', '#afff8b', '#d7ffc2']);

    // Initialize viz before any selections or filtering
    updatePlot();

    // Function to plot the bars on viz1 based on filters and selection (if any)
    function plot_bars() {

        // Filter data down to only selected tickers
        let filtered_data = data.filter(d => cur_companies.includes(d.tic));

        // groups based off tic
        const groups = filtered_data.map(d => d.tic);

        // Scaled needed to be re-initialized based on the changed data
        // creating scales
        const X_SCALE = d3.scaleBand()
            .domain(groups)
            .range([0, VIS_WIDTH])
            .padding(PADDING);

        // max y value
        const Y_MAX = d3.max(filtered_data, (d) => {
            return Math.max(d.at/d.at, d.lt/d.at, d.teq/d.at)
        });

        // y scale needed
        const Y_SCALE = d3.scaleLinear()
            .domain([0, Y_MAX])
            .range([VIS_HEIGHT, 0])

        // add y axis
        FRAME1.append('g')
            .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
            .attr('class', 'axis')
            .call(d3.axisLeft(Y_SCALE).ticks(10))
            .attr('font-size', '10px');


        // add x axis
        FRAME1.append('g')
            .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
            .attr('class', 'axis')
            .call(d3.axisBottom(X_SCALE).ticks(3))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('font-size', '10px')
            .attr('transform', 'rotate(-45)');

        // x axis label
        FRAME1.append('text')
            .attr('x', VIS_WIDTH/2 + MARGINS.left)
            .attr('y', FRAME_HEIGHT - 20)
            .style('text-anchor', 'middle')
            .text('Ticker')
            .attr('font-size', '12px');


        // Create color map and bar stack series
        const asset_stack = d3.stack()
            .keys(asset_subgroups)
            (filtered_data.filter(d => d.fyear === cur_year));

        // Create color map and bar stack series        
        const liab_stack = d3.stack()
            .keys(liab_subgroups)
            (filtered_data.filter(d => d.fyear === cur_year));

        // Create color map and bar stack series
        const eq_stack = d3.stack()
            .keys(eq_subgroups)
            (filtered_data.filter(d => d.fyear === cur_year));

        // Build svg components to store liability bars
        let liab_bars = g_liab
            .selectAll('g.series')
            .data(liab_stack)
            .join('g')
            .classed('series', true)
            .style('fill', (d) => liab_color(d.key))

        // Fill bars into above spaces
        liab_bars.selectAll('rect')
            .data((d) => d)
            .join('rect')
            .attr('width', X_SCALE.bandwidth()/2)
            .attr('x', (d) => X_SCALE(d.data.tic) + MARGINS.right + X_SCALE.bandwidth() / 4)
            .attr('height', (d) => Y_SCALE(d[0]) - Y_SCALE(d[1]))
            .attr('y', (d) => Y_SCALE(d[1]) + MARGINS.bottom)
            .style("opacity", 0.4);

        // Fill svg container with individual svgs for assets
        let asset_bars = g_assets
            .selectAll('g.series')
            .data(asset_stack)
            .join('g')
            .classed('series', true)
            .style('fill', (d) => asset_color(d.key));

        // Append rectangles to each g container
        asset_bars.selectAll('rect')
            .data((d) => d)
            .join('rect')
            .attr('width', X_SCALE.bandwidth()/2)
            .attr('x', (d) => X_SCALE(d.data.tic) - X_SCALE.bandwidth() / 2 + MARGINS.right + X_SCALE.bandwidth() / 4)
            .attr('height', (d) => Y_SCALE(d[0]) - Y_SCALE(d[1]))
            .attr('y', (d) => Y_SCALE(d[1]) + MARGINS.bottom)
            .style("opacity", 0.4);

        // Svg containers for equity bars
        let eq_bars = g_eq
            .selectAll('g.series')
            .data(eq_stack)
            .join('g')
            .classed('series', true)
            .style('fill', (d) => eq_color(d.key))

        // Add rectangles to represent equity
        eq_bars.selectAll('rect')
            .data((d) => d)
            .join('rect')
            .attr('width', X_SCALE.bandwidth()/2)
            .attr('x', (d) => X_SCALE(d.data.tic) + X_SCALE.bandwidth()/2 + MARGINS.right + X_SCALE.bandwidth() / 4)
            .attr('height', (d) => Y_SCALE(d[0]) - Y_SCALE(d[1]))
            .attr('y', (d) => Y_SCALE(d[1]) + MARGINS.bottom)
            .style("opacity", 0.4);

    };

    function tooltips() {
        // adding a tooltip for hover functionality
        const TOOLTIP = d3.select("#vis1")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

    // handling the mouse entering the space
    function handleMouseover(event, d) {
        TOOLTIP.style("opacity", 1);
        d3.select(this)
            .style("opacity", 1);
    }

    // handing a mouse movement
    function handleMousemove(event, d) {
        // will check the key where the val exists, but will have plot_ in front of it
        // 1 shows up as .99999 so we rounded to 6 decimal points when checking
        let key = Object.keys(d.data).find(k => d3.format(".6f")(parseFloat(d.data[k])) === d3.format(".6f")(d[1] - d[0]));

        // Rename key to account for data transformation
        let true_key = key.replace("plot_", "");

        // showing the tooltip with proper information
        TOOLTIP.html("<b>" + DEFINITIONS[true_key] + "</b><br/><i>" + d.data.conm + "</i><br/>Value: $" + d3.format(".2f")(formatNumber((d.data[true_key]/1000))) + 
        " Billion<br/>" + d3.format(".2f")(100 * d.data[true_key] / d.data.at) + "% of Total Assets ($" + d3.format(".2f")(formatNumber(d.data.at / 1000)) + " Billion)")
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px");
    }

    // handling the mouse exiting
    function handleMouseleave(event, d) {
        TOOLTIP.style("opacity", 0)
        if (d.data.tic !== selectedBars.tic) {
            d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.4)
        }
    }

    // Function to select individual bars to view their long term information
    function handleMouseclick(event, d) {
        selectedBars = { tic: d.data.tic };

        // Set the opacity of the clicked bars to 1 and update the selectedBars variable
        FRAME1.selectAll("rect")
            .filter(d => d.data.tic === selectedBars.tic)
            .style("opacity", 1);

        // Every non-selected bar gets lower opacity to show distincition
        FRAME1.selectAll("rect")
            .filter(d => d.data.tic !== selectedBars.tic)
            .style("opacity", 0.4);

        // Update long term plot
        updateLine(d.data.tic);

        // Update viz title based on selected company
        d3.select("#tic-title")
            .text(d.data.tic + " Stacked Area Time-Series");
    }

    // tooltip functionality on different situations
    FRAME1.selectAll("rect")
        .on("mouseover", handleMouseover)
        .on("mousemove", handleMousemove)
        .on("mouseleave", handleMouseleave)
        .on("click", handleMouseclick);
    }

    // dot for legend
    FRAME1.selectAll("mydots")
        .data(vis1_keys)
        .enter()
        .append("circle")
        .attr("cx", VIS_WIDTH + MARGINS.left)
        .attr("cy", function(d,i){ return MARGINS.left + i*25}) 
        .attr("r", 4)
        .style("fill", function(d,i){ return key_colors[i]});

    // text for legend
    FRAME1.selectAll("mylabels")
        .data(vis1_keys)
        .enter()
        .append("text")
        .attr("x", VIS_WIDTH + MARGINS.left + 10)
        .attr("y", function(d,i){ return MARGINS.left + i*25})
        .style("fill", function(d,i){ return key_colors[i]})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size","12px");
        

    // Frame 2: Time Series Viz
    let accountOptions = [
        {label: 'Assets', value: ['act', 'ppent', 'ivaeq', 'ivao', 'intan', 'ao']},
        {label: 'Liabilities', value: ['lct', 'txditc', 'lo', 'dltt']},
        {label: "Stockholders' Equity", value: ['ceq', 'pstk', 'mibn']}
    ]
    
    // for plotting different account breakdowns
    d3.select("#selectAccounts")
        .selectAll("option")
        .data(accountOptions)
        .enter()
        .append("option")
        .text(d => d.label)
        .attr("value", d => d.value);

    // x axis label
    FRAME2.append('text')
        .attr('x', VIS_WIDTH/2 + MARGINS.left)
        .attr('y', FRAME_HEIGHT - 20)
        .style('text-anchor', 'middle')
        .text('Year')
        .attr('font-size', '12px');

    // y axis label
    FRAME2.append('text')
        .attr('y', 35)
        .attr('x', 0 - VIS_HEIGHT/2 - MARGINS.top)
        .style('text-anchor', 'middle')
        .text('Value (Billions of Dollars)')
        .attr('font-size', '12px')
        .attr('transform', 'rotate(-90)')

    // finding the unique years in the data
    const years = Array.from(new Set(data.map(d => d.fyear)));
    

    // line plot update function
    function updateLine(tic) {    
        cur_tic = tic

        // Clear the frame of all paths in the stacked area plot
        FRAME2.selectAll("path").remove();

        // get rid of all axis to recalc the y axis
        FRAME2.selectAll("g").remove();

        // Plots the new areas
        plot_lines();
        tooltips2();
        }
    
    function plot_lines() {
        // filtering by selected tic
        let filteredData = data.filter(function(d) {
            return d.tic === cur_tic;
          });
        
        Y_MAX2 = d3.max(filteredData, (d) => {
            return (Math.max(1.05 * d.at / 1000))
        });

        Y_SCALE2 = d3.scaleLinear()
            .domain([0, Y_MAX2])
            .range([VIS_HEIGHT, 0]);

        X_SCALE2 = d3.scaleLinear()
            .domain([2010,2022])
            .range([0, VIS_WIDTH]);

        // add y axis
        FRAME2.append('g')
            .attr('transform', 'translate(' + MARGINS.top + ',' + MARGINS.left + ')')
            .call(d3.axisLeft(Y_SCALE2).ticks(10).tickPadding(0))
            .attr('font-size', '10px');

        // add x axis
        FRAME2.append('g')
            .attr('transform', 'translate(' + MARGINS.left + ',' + (VIS_HEIGHT + MARGINS.top) + ')')
            .call(d3.axisBottom(X_SCALE2).tickFormat(d3.format("d")))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('font-size', '10px')
            .attr('transform', 'rotate(-45)');
        
        split = selectedValue.split(',');

        const stack = d3.stack()
            .keys(split)

        // generate a stack from the filtered data
        const stackData = stack(filteredData);

        // create an area generator
        const area = d3.area()
            .x(d => X_SCALE2(parseInt(d.data.fyear))+MARGINS.right)
            .y0(d => Y_SCALE2(d[0] / 1000) + MARGINS.top)
            .y1(d => Y_SCALE2(d[1] / 1000) + MARGINS.top);

        // getting the color scale based of the keys
        function getAreaColor(d, all_subgroups, asset_subgroups, liab_subgroups, all_color, asset_color, liab_color, eq_color) {
                let color;
                if (all_subgroups.indexOf('plot_' + d.key) !== -1) {
                    color = all_color('plot_' + d.key);
                } else if (asset_subgroups.indexOf('plot_' + d.key) !== -1) {
                    color = asset_color('plot_' + d.key);
                } else if (liab_subgroups.indexOf('plot_' + d.key) !== -1) {
                    color = liab_color('plot_' + d.key);
                } else {
                    color = eq_color('plot_' + d.key);
                }
                return color;
              }

        // plot the stacked areas
        FRAME2.selectAll(".area")
            .data(stackData)
            .enter()
            .append("path")
            .attr("class", "area")
            .style("fill", d => getAreaColor(d, all_subgroups, asset_subgroups, liab_subgroups, all_color, asset_color, liab_color, eq_color))
            .attr('d', area)
            .style("opacity", 0.5);
        
        
    }    

    function tooltips2() {
        // adding a tooltip2 for hover functionality
        const TOOLTIP2 = d3.select("#vis2")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        // handling the mouse entering the space
        function handleMouseover2(event, d) {
            TOOLTIP2.style("opacity", 1);
            d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", 2)
                .style("opacity", 1);
        }

        // handing a mouse movement
        function handleMousemove2(event, d) {
            let true_key = d.key;

            // showing the tooltip with proper information
            TOOLTIP2.html("<b>" + DEFINITIONS[true_key] + "</b>")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 25) + "px");
        }

        // handling the mouse exiting
        function handleMouseleave2(event, d) {
            TOOLTIP2.style("opacity", 0)
            d3.select(this)
                .style("opacity", 0.5)
                .style("stroke", "none");
        }

        // tooltip functionality on different situations
        FRAME2.selectAll(".area")
            .on("mouseover", handleMouseover2)
            .on("mousemove", handleMousemove2)
            .on("mouseleave", handleMouseleave2)
    }

    // defaults when viz loads up
    let selectedValue = 'act,ppent,ivaeq,ivao,intan,ao';

    updateLine('AAPL');
    FRAME1.selectAll("rect")
            .filter(d => d.data.tic === 'AAPL')
            .style("opacity", 1);
    selectedBars = { tic: 'AAPL' };
    document.getElementById('tic-title').innerHTML = 'AAPL Stacked Area Time-Series';
    document.getElementById('year-title').innerHTML = '2010 Balance Sheet Breakdown';

    // event listener on the dropdown element
    d3.select("#selectAccounts")
        .on("change", function() {
            selectedValue = d3.select(this).property("selectedOptions")[0].value;
            updateLine(cur_tic)
    });
});
