export const init = () => {
    console.log('Initializing dashboard');

    let board = void 0;
let instances = void 0;
let currentInstanceId = void 0;

// Propias
const instancesURL = 'http://localhost/SoonFront/src/api/instances.json';
const instancesDetailsURL = "http://localhost/SoonFront/src/api/instances-details.json";

// Originales
const instancesOriginalURL = 'https://demo-live-data.highcharts.com/instances.json';
const instancesDetailsOriginalURL = "https://demo-live-data.highcharts.com/instance-details.json";

const pollingCheckbox = document.getElementById('enablePolling');
const KPIOptions = {
    chart: {
        height: 165,
        margin: [0, 0, 0, 0],
        spacing: [0, 0, 0, 0],
        type: 'solidgauge'
    },
    yAxis: {
        min: 0,
        max: 100,
        stops: [
            [0.1, '#33A29D'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ]
    },
    pane: {
        background: {
            innerRadius: '80%',
            outerRadius: '100%'
        }
    },
    accessibility: {
        typeDescription: 'The gauge chart with 1 data point.'
    }
};

Highcharts.setOptions({
    credits: {
        enabled: false
    },
    title: {
        text: ''
    }
});

pollingCheckbox.onchange = async e => {
    if (e.target.checked) {
        // charts data
        (await board.dataPool.getConnector('charts')).startPolling();
        // KPI instances data
        (await board.dataPool.getConnector('instanceDetails')).startPolling();
    } else {
        // charts data
        (await board.dataPool.getConnector('charts')).stopPolling();
        // KPI instances data
        (await board.dataPool.getConnector('instanceDetails')).stopPolling();
    }
};

const setupDashboard = instanceId => {
    const instance = instances.find(
        instance => instance.InstanceId === instanceId
    ) || instances[0];

    // for polling option
    currentInstanceId = instance.InstanceId;

    board = Dashboards.board('container', {
        dataPool: {
            connectors: [{
                id: 'charts',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    columnNames: [
                        'timestamp', 'readOpt', 'writeOpt', 'networkIn',
                        'networkOut', 'cpuUtilization'
                    ],
                    dataUrl: instancesDetailsURL,
                    beforeParse: function (data) {
                        const currentInstance = data.find(
                            inst => inst.InstanceId === currentInstanceId
                        ) || data;
                        return currentInstance.Details.map(
                            el => el
                        );
                    }
                }
            }, {
                id: 'instanceDetails',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    orientantion: 'columns',
                    columnNames: [
                        'index', 'CPUUtilization', 'MemoryUsage', 'DiskSizeGB',
                        'DiskUsedGB', 'DiskFreeGB', 'MediaGB', 'RootGB',
                        'Documents', 'Downloads'
                    ],
                    dataUrl: instancesURL,
                    beforeParse: function (data) {
                        const currentInstance = data.find(
                            inst => inst.InstanceId === currentInstanceId
                        ) || data;
                        const diskSpace = currentInstance.DiskSpace.RootDisk;
                        return [
                            [
                                0, // display one record on chart KPI / disk
                                currentInstance.CPUUtilization,
                                currentInstance.MemoryUsage,
                                diskSpace.SizeGB,
                                diskSpace.UsedGB,
                                diskSpace.FreeGB,
                                diskSpace.MediaGB,
                                diskSpace.RootGB,
                                diskSpace.Documents,
                                diskSpace.Downloads
                            ]
                        ];
                    }
                }
            }, {
                id: 'instances',
                type: 'JSON',
                options: {
                    firstRowAsNames: false,
                    data: instances
                }
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    id: 'instance-details',
                    cells: []
                }, {
                    cells: [{
                        id: 'instances-table'
                    }, {
                        id: 'kpi-wrapper',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'cpu'
                                }, {
                                    id: 'memory'
                                }]
                            }, {
                                cells: [{
                                    id: 'health'
                                }, {
                                    id: 'disk'
                                }]
                            }]
                        }
                    }]
                }, {
                    cells: [{
                        id: 'disk-usage'
                    }, {
                        id: 'cpu-utilization'
                    }]
                }, {
                    cells: [{
                        id: 'network-opt'
                    }, {
                        id: 'disk-opt'
                    }]
                }]
            }]
        },
        components: [ {
            cell: 'disk-usage',
            title: 'Accidentes en las rutas de la semana',
            type: 'Highcharts',
            connector: {
                id: 'instanceDetails',
                columnAssignment: [{
                    seriesId: 'media-gb',
                    data: ['x', 'MediaGB']
                }, {
                    seriesId: 'root-gb',
                    data: ['x', 'RootGB']
                }, {
                    seriesId: 'documents',
                    data: ['x', 'Documents']
                }, {
                    seriesId: 'downloads',
                    data: ['x', 'Downloads']
                }]
            },
            chartOptions: {
                xAxis: {
                    min: -0.5,
                    max: 3.5,
                    showFirstLabel: false,
                    showLastLabel: false,
                    type: 'category',
                    categories: ['Zona Rio', 'Insurgentes', 'Tecate Libre', '2000'],
                    accessibility: {
                        description: 'Disk categories'
                    }
                },
                series: [{
                    name: 'Zona Rio',
                    id: 'media-gb',
                    pointStart: 0,
                    pointPlacement: -0.3
                }, {
                    name: 'Insurgentes',
                    id: 'root-gb',
                    pointStart: 1,
                    pointPlacement: -0.1
                }, {
                    name: 'Tecate Libre',
                    id: 'documents',
                    pointStart: 2,
                    pointPlacement: 0.1
                }, {
                    name: '2000',
                    id: 'downloads',
                    pointStart: 3,
                    pointPlacement: 0.4
                }],
                yAxis: {
                    title: {
                        text: 'Número de accidentes'
                    },
                    accessibility: {
                        description: 'Gigabytes'
                    }
                },
                legend: {
                    enabled: false
                },
                chart: {
                    type: 'bar'
                },
                tooltip: {
                    headerFormat: '',
                    valueSuffix: ' Accidentes'
                },
                plotOptions: {
                    series: {
                        relativeXValue: true,
                        pointRange: 1,
                        pointPadding: 0,
                        groupPadding: 0,
                        pointWidth: 40,
                        dataLabels: {
                            enabled: true,
                            format: '{y} Accidentes'
                        }
                    }
                },
                lang: {
                    accessibility: {
                        chartContainerLabel: 'Disk usage. Highcharts ' +
                            'interactive chart.'
                    }
                },
                accessibility: {
                    description: 'The chart is displaying space on disk'
                }
            }
        },
        {
            cell: 'cpu-utilization',
            title: 'Tráfico por hora',
            type: 'Highcharts',
            connector: {
                id: 'charts',
                columnAssignment: [{
                    seriesId: 'cpu-utilization',
                    data: ['timestamp', 'cpuUtilization']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                chart: {
                    type: 'spline'
                },
                series: [{
                    name: 'Nivel de tráfico',
                    id: 'cpu-utilization'
                }],
                xAxis: {
                    type: 'datetime',
                    accessibility: {
                        description: 'Days'
                    }
                },
                yAxis: {
                    min: 0,
                    max: 100,
                    title: {
                        text: 'Nivel de tráfico'
                    },
                    accessibility: {
                        description: 'Percents'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    valueSuffix: '%'
                },
                accessibility: {
                    description: 'The chart is displaying CPU usage',
                    point: {
                        valueDescriptionFormat: 'percents'
                    }
                }
            }
        },
        {
            cell: 'cpu',
            type: 'KPI',
            connector: {
                id: 'instanceDetails'
            },
            columnName: 'CPUUtilization',
            chartOptions: {
                ...KPIOptions,
                plotOptions: {
                    series: {
                        className: 'highcharts-live-kpi',
                        dataLabels: {
                            format: '<div style="text-align:center; padding-buttom: 8px; ' +
                                'margin-top: -20px">' +
                            '<div style="font-size:1.2em;">{y}%</div>' +
                            '<div style="font-size:14px; opacity:0.4; ' +
                            'text-align: center;">Rendimiento</div>' +
                            '</div>',
                            useHTML: true
                        }
                    }
                },
                series: [{
                    name: 'CPU utilization',
                    innerRadius: '80%',
                    data: [{
                        colorIndex: '100'
                    }],
                    radius: '100%'
                }],
                xAxis: {
                    accessibility: {
                        description: 'Days'
                    }
                },
                lang: {
                    accessibility: {
                        chartContainerLabel: 'CPU usage. Highcharts ' +
                            'interactive chart.'
                    }
                },
                tooltip: {
                    valueSuffix: '%'
                }
            }
        }, {
            cell: 'memory',
            type: 'KPI',
            connector: {
                id: 'instanceDetails'
            },
            columnName: 'MemoryUsage',
            chartOptions: {
                ...KPIOptions,
                yAxis: {
                    min: 0,
                    max: 2048,
                    stops: [
                        [0.1, '#33A29D'], // green
                        [0.5, '#DDDF0D'], // yellow
                        [0.9, '#DF5353'] // red
                    ]
                },
                plotOptions: {
                    series: {
                        className: 'highcharts-live-kpi',
                        dataLabels: {
                            format: '<div style="text-align:center; padding-buttom: 8px; ' +
                                'margin-top: -20px">' +
                            '<div style="font-size:1.2em;">2 RP</div>' +
                            '<div style="font-size:14px; opacity:0.4; ' +
                            'text-align: center;">Reportes</div>' +
                            '</div>',
                            useHTML: true
                        }
                    }
                },
                series: [{
                    name: 'Memory usage',
                    innerRadius: '80%',
                    data: [{
                        colorIndex: '100'
                    }],
                    radius: '100%'
                }],
                lang: {
                    accessibility: {
                        chartContainerLabel: 'Memory usage. Highcharts ' +
                            'interactive chart.'
                    }
                },
                tooltip: {
                    valueSuffix: ' MB'
                }
            }
        },
        {
            cell: 'health',
            type: 'HTML',
            class: 'health-indicator',
            elements: [{
                tagName: 'div',
                class: 'health-wrapper highcharts-' + instance.HealthIndicator +
                    '-icon',
                attributes: {
                    'aria-label': 'Health: ' + instance.HealthIndicator,
                    role: 'img'
                }
            }, {
                tagName: 'div',
                class: 'health-title',
                textContent: 'Correcto'
            }]
        },
        {
            cell: 'disk',
            type: 'KPI',
            connector: {
                id: 'instanceDetails'
            },
            columnName: 'DiskUsedGB',
            chartOptions: {
                ...KPIOptions,
                plotOptions: {
                    series: {
                        dataLabels: {
                            format: '<div style="text-align:center; padding-buttom: 8px; ' +
                                'margin-top: -20px">' +
                            '<div style="font-size:1.2em;">22.2</div>' +
                            '<div style="font-size:14px; opacity:0.4; ' +
                            'text-align: center;">Nivel de tráfico</div>' +
                            '</div>',
                            useHTML: true
                        }
                    }
                },
                series: [{
                    name: 'Disk usage',
                    innerRadius: '80%',
                    data: [{
                        colorIndex: '100'
                    }],
                    radius: '100%'
                }],
                tooltip: {
                    valueSuffix: ' Gb'
                },
                lang: {
                    accessibility: {
                        chartContainerLabel: 'Disk usage. Highcharts ' +
                            'interactive chart.'
                    }
                }
            }
        },
        {
            cell: 'network-opt',
            type: 'Highcharts',
            title: 'Tráfico en diferentes líneas    ',
            connector: {
                id: 'charts',
                columnAssignment: [{
                    seriesId: 'in',
                    data: ['timestamp', 'networkIn']
                }, {
                    seriesId: 'out',
                    data: ['timestamp', 'networkOut']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                chart: {
                    type: 'spline'
                },
                xAxis: {
                    type: 'datetime',
                    accessibility: {
                        description: 'Days'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Nivel de tráfico'
                    },
                    accessibility: {
                        description: 'Bytes'
                    }
                },
                legend: {
                    labelFormatter: function () {
                        const result =
                            this.name.replace(/([A-Z])/g, ' $1').toLowerCase();
                        return result.charAt(0).toUpperCase() + result.slice(1);
                    }
                },
                tooltip: {
                    valueDecimals: 0,
                    valueSuffix: ' puntos'
                },
                accessibility: {
                    description: `The chart is displaying amount of in and out
                                network operations`,
                    point: {
                        valueDescriptionFormat: 'bytes'
                    }
                },
                series: [{
                    name: 'Zona Rio',
                    id: 'in'
                }, {
                    name: 'Insurgentes',
                    id: 'out'
                }]
            }
        },
        {
            cell: 'disk-opt',
            type: 'Highcharts',
            title: 'Trasacciones realizadas por hora',
            connector: {
                id: 'charts',
                columnAssignment: [{
                    seriesId: 'Zona Rio',
                    data: ['timestamp', 'readOpt']
                }, {
                    seriesId: 'Insurgentes',
                    data: ['timestamp', 'writeOpt']
                }]
            },
            sync: {
                highlight: true
            },
            chartOptions: {
                chart: {
                    type: 'column'
                },
                xAxis: {
                    type: 'datetime',
                    accessibility: {
                        description: 'Days'
                    }
                },
                tooltip: {
                    valueDecimals: 0,
                    valueSuffix: ' trasacciones'
                },
                yAxis: {
                    title: {
                        text: 'Trasacciones'
                    },
                    accessibility: {
                        description: 'Operations'
                    }
                },
                legend: {
                    labelFormatter: function () {
                        const result =
                            this.name.replace(/([A-Z])/g, ' $1').toLowerCase();
                        return result.charAt(0).toUpperCase() + result.slice(1);
                    }
                },
                accessibility: {
                    description: `The chart is displaying amount of in and out
                                operations on disk`,
                    point: {
                        valueDescriptionFormat: 'operations'
                    }
                }
            }
        },
        {
            cell: 'instances-table',
            type: 'DataGrid',
            title: 'Rutas más concurridas',
            visibleColumns: [
                'InstanceId', 'InstanceType', 'HealthIndicator'
            ],
            dataGridOptions: {
                editable: false,
                columns: {
                    InstanceId: {
                        headerFormat: 'Ruta'
                    },
                    InstanceType: {
                        headerFormat: 'Tráfico'
                    },
                    HealthIndicator: {
                        headerFormat: 'Estado'
                    }

                },
                events: {
                    
                }
            },
            connector: {
                id: 'instances'
            },
            events: {
                
            }
        }]
    });
};

// Init
(async () => {
    // load init list of intances
    try {
        instances = await fetch(instancesURL).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    } catch (error) {
        console.error('Error fetching instances:', error);
    }

    setupDashboard();
    // run polling
    await pollingCheckbox.click();
})();

}

