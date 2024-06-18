import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import PropTypes from "prop-types";
import { CalendarAE } from "../CalendarAE";
import { useContext, useState } from "react";
import MainContext from "../../context/MainContext";
import { URL_BASE } from "@/config/config";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import LoaderAE from "../LoaderAE"; // Importar el componente LoaderAE
import RadarByDay from "./RadarByDay";

export function AttendanceByDay({ value }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [onlyTuesday, setOnlyTuesday] = useState(true);
  const [loading, setLoading] = useState(false);
  const [attendedStudents, setAttendedStudents] = useState([]);
  const [notAttendedStudents, setNotAttendedStudents] = useState([]);
  const [allData, setAllData] = useState([]);
  const { toast } = useToast();

  // CONTEXTO
  const { user } = useContext(MainContext);

  const loadData = async () => {
    try {
      setAttendedStudents([]);
      setNotAttendedStudents([]);
      setLoading(true);
      if (!selectedDate) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "La fecha es obligatoria",
          duration: 2500,
        });
        return;
      }

      const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
      const response = await fetch(`${URL_BASE}/get/getAttendanceByDateAndTutor/${formattedDate}/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAttendedStudents(data.attendedStudents);
        setNotAttendedStudents(data.notAttendedStudents);
        setAllData(data);
        console.log(allData);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al consultar las asistencias.",
        duration: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = () => {
    setOnlyTuesday(!onlyTuesday);
  };

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle>Asistencia por día</CardTitle>
          <CardDescription>Lista de alumnos y su asistencia por día</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 flex flex-col pt-4 sm:justify-center sm:items-center">
            <CalendarAE title="Fecha de asistencia" setDate={setSelectedDate} onlyTuesday={onlyTuesday} />
            <label className="flex items-center space-x-2 w-full justify-end sm:justify-center">
              <input
                type="checkbox"
                checked={onlyTuesday}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-dark-600 dark:text-white-400"
              />
              <span className="text-gray-700 dark:text-gray-300">Mostrar solo los Martes</span>
            </label>
          </div>
          <Button disabled={loading} onClick={loadData} className="w-full sm:w-[300px] m-auto justify-center flex">
            {loading ? <LoaderAE /> : "Mostrar asistencias registradas"}
          </Button>
          <br />
          {(attendedStudents.length > 0 || notAttendedStudents.length > 0) && <RadarByDay data={allData} />}
          {/* Tabla de alumnos que asistieron */}
          {attendedStudents.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-green-500 text-lg font-bold">Alumnos que asistieron:</h2>
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-green-500">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">#</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Nombre</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Teléfono</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Tipo de Asistencia</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Pregunta</th>
                  </tr>
                </thead>
                <tbody>
                  {attendedStudents.map((student, index) => (
                    <tr key={student.AlumnoID}>
                      <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2">{student.AlumnoNombres}</td>
                      <td className="border border-gray-200 px-4 py-2">{student.AlumnoTelefono}</td>
                      <td className="border border-gray-200 px-4 py-2">{student.TipoAsistencia}</td>
                      <td className="border border-gray-200 px-4 py-2 overflow-x-auto max-w-[100px]">
                        {student.Pregunta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tabla de alumnos que no asistieron */}
          {notAttendedStudents.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-red-500 text-lg font-bold">Alumnos que no asistieron:</h2>
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-red-500">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">#</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Nombre</th>
                    <th className="border border-gray-200 px-4 py-2 text-white dark:text-white">Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {notAttendedStudents.map((student, index) => (
                    <tr key={student.AlumnoID}>
                      <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-200 px-4 py-2">{student.AlumnoNombres}</td>
                      <td className="border border-gray-200 px-4 py-2">{student.AlumnoTelefono}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

AttendanceByDay.propTypes = {
  value: PropTypes.string.isRequired,
};
